use candid::{CandidType, Deserialize};
use ic_cdk::update;
use prost::Message;
use tract_ndarray::Array2;
use tract_onnx::prelude::*;
use anyhow::anyhow;

#[derive(CandidType, Deserialize)]
struct PredictionFailed {
    message: String,
}

#[derive(CandidType, Deserialize)]
enum PredictionResult {
    Success {
        probability: f32,
        is_illicit: bool,
    },
    Failure(PredictionFailed),
}
// Embedded ONNX model (already converted)
const MODEL: &'static [u8] = include_bytes!("ransomware_model.onnx");

fn parse_csv_features(csv: &str) -> TractResult<Tensor> {
    let features: Vec<f32> = csv
        .split(',')
        .map(|v| v.trim().parse::<f32>())
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| anyhow!("Failed to parse floats: {:?}", e))?;

    if features.len() != 66 {
        return Err(anyhow!("Input does not contain exactly 66 features"));
    }

    let input = Array2::from_shape_vec((1, 66), features)?;
    Ok(Tensor::from(input))
}

#[update]
async fn predict_address(csv_features: String) -> PredictionResult {
    // Load the model once per call (or cache in stable var for efficiency)
    let bytes = bytes::Bytes::from_static(MODEL);
    let proto = tract_onnx::pb::ModelProto::decode(bytes);

    if let Err(e) = proto {
        return PredictionResult::Failure(PredictionFailed {
            message: format!("Failed to decode ONNX model: {}", e),
        });
    }

    let proto = proto.unwrap();
    let model_result = tract_onnx::onnx()
        .model_for_proto_model(&proto)
        .and_then(|m| m.into_optimized())
        .and_then(|m| m.into_runnable());

    if let Err(e) = model_result {
        return PredictionResult::Failure(PredictionFailed {
            message: format!("Failed to prepare model: {}", e),
        });
    }

    let model = model_result.unwrap();

    // Parse the 66 features from input
    let input_tensor = match parse_csv_features(&csv_features) {
        Ok(tensor) => tensor,
        Err(e) => {
            return PredictionResult::Failure(PredictionFailed {
                message: format!("Input parse error: {}", e),
            })
        }
    };

    // Run model inference
    let result = model.run(tvec!(input_tensor.into()));
    if let Err(e) = result {
        return PredictionResult::Failure(PredictionFailed {
            message: format!("Inference error: {}", e),
        });
    }

    let outputs = result.unwrap();
    let probs = outputs[1].to_array_view::<f32>();
    if let Err(e) = probs {
        return PredictionResult::Failure(PredictionFailed {
            message: format!("Failed to read output: {}", e),
        });
    }

    let prob_array = probs.unwrap();
    let prob_illicit = prob_array[1]; // [0] = legit, [1] = illicit
    let is_illicit = prob_illicit >= 0.5;

    PredictionResult::Success {
        probability: prob_illicit,
        is_illicit,
    }
}

ic_cdk::export_candid!();