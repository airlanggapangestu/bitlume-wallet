from flask import Flask, request, jsonify
from xgverifyv3 import predict_ransomware
import traceback

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'address' not in data:
        return jsonify({'error': 'Please provide a Bitcoin address in the JSON payload'}), 400

    address = data['address']
    print(f"[API] Received address for prediction: {address}")

    try:
        result = predict_ransomware(address)
    except Exception as e:
        print("[API ERROR] Exception during prediction:")
        traceback.print_exc()  # Cetak traceback ke terminal/log
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

    if result is None:
        return jsonify({'error': 'Failed to analyze the address or fetch data'}), 500

    return jsonify(result)

@app.route('/', methods=['GET'])
def home():
    return "🚀 Ransomware Detection API is running!", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
