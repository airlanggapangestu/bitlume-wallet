use candid::{CandidType, Deserialize};
use ic_cdk::update;
use prost::Message;
use tract_ndarray::Array2;
use tract_onnx::prelude::*;
use anyhow::anyhow;
use getrandom::register_custom_getrandom;

pub fn custom_getrandom(_buf: &mut [u8]) -> Result<(), getrandom::Error> {
    Err(getrandom::Error::UNSUPPORTED)
}

register_custom_getrandom!(custom_getrandom);

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
const MODEL: &'static [u8] = include_bytes!("analysis_model.onnx");

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
    let bytes = bytes::Bytes::from_static(MODEL);
    let proto = match tract_onnx::pb::ModelProto::decode(bytes) {
        Ok(p) => p,
        Err(e) => {
            return PredictionResult::Failure(PredictionFailed {
                message: format!("Model decode error: {}", e),
            });
        }
    };
    let model = match tract_onnx::onnx()
        .model_for_proto_model(&proto)
        .and_then(|m| m.into_optimized())
        .and_then(|m| m.into_runnable()) {
            Ok(m) => m,
            Err(e) => {
                return PredictionResult::Failure(PredictionFailed {
                    message: format!("Model load error: {}", e),
                });
            }
        };

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

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

// Enable Candid export
ic_cdk::export_candid!();