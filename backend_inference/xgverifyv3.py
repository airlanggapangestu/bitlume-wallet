# --- inference.py (Complete Feature Alignment) ---

import requests
import pandas as pd
import numpy as np
import json
import time
import os
import joblib
import argparse
from collections import defaultdict, Counter

# --- Configuration ---
CACHE_FILE = 'local_tx_cache.json'
MODEL_FILE = 'enhanced_ransomware_model_v3.joblib'
SATOSHI_TO_BTC = 100_000_000

def fetch_transactions(address):
    """Fetches transaction data for an address, using a local cache."""
    print(f"\n[FETCHER] Looking for address: {address}")
    cache = {}
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, 'r') as f:
            cache = json.load(f)
    if address in cache:
        print("[FETCHER] Found in cache.")
        return cache[address]

    print("[FETCHER] Not in cache. Calling blockchain.info API...")
    api_url = f"https://blockchain.info/rawaddr/{address}"
    try:
        response = requests.get(api_url, timeout=45)
        response.raise_for_status()
        data = response.json()
        transactions = data.get('txs', [])
        print(f"[FETCHER] SUCCESS: Found {len(transactions)} transactions.")
        
        cache[address] = transactions
        with open(CACHE_FILE, 'w') as f:
            json.dump(cache, f, indent=2)

        time.sleep(10)
        return transactions
    except requests.exceptions.RequestException as e:
        print(f"[FETCHER] ERROR: {e}")
        return None

def extract_all_addresses_from_tx(tx):
    """Extract all unique addresses involved in a transaction."""
    addresses = set()
    
    # Input addresses
    for inp in tx.get('inputs', []):
        if inp.get('prev_out') and inp['prev_out'].get('addr'):
            addresses.add(inp['prev_out']['addr'])
    
    # Output addresses
    for out in tx.get('out', []):
        if out.get('addr'):
            addresses.add(out['addr'])
    
    return addresses

def safe_stats(values):
    """Calculate statistics safely handling empty lists."""
    if not values:
        return {'min': 0.0, 'max': 0.0, 'mean': 0.0, 'median': 0.0, 'total': 0.0}
    
    return {
        'min': float(min(values)),
        'max': float(max(values)),
        'mean': float(np.mean(values)),
        'median': float(np.median(values)),
        'total': float(sum(values))
    }

def build_feature_dict(transactions, target_address):
    """Extract comprehensive 56-feature vector from transaction data - EXACT COPY from add_new_sample_enhanced.py"""
    print(f"[TRANSLATOR] Building comprehensive feature vector for: {target_address}")
    if not transactions:
        return None

    # Sort transactions by time
    transactions.sort(key=lambda x: x.get('time', 0))
    
    # Initialize data collectors
    sent_transactions = []
    received_transactions = []
    all_transaction_values = []
    all_fees = []
    block_heights = []
    transaction_times = []
    all_counterparty_addresses = []
    address_interaction_counts = Counter()
    
    # Process each transaction
    for tx in transactions:
        tx_time = tx.get('time', 0)
        tx_block = tx.get('block_height', 0)
        tx_fee = tx.get('fee', 0)
        
        if tx_block > 0:
            block_heights.append(tx_block)
        if tx_time > 0:
            transaction_times.append(tx_time)
        
        # Always include fees (even if 0) for transactions
        all_fees.append(tx_fee)
        
        # Check if target address is sender
        is_sender = False
        sent_value = 0
        for inp in tx.get('inputs', []):
            if inp.get('prev_out') and inp['prev_out'].get('addr') == target_address:
                is_sender = True
                sent_value += inp['prev_out'].get('value', 0)
        
        # Check if target address is receiver
        is_receiver = False
        received_value = 0
        for out in tx.get('out', []):
            if out.get('addr') == target_address:
                is_receiver = True
                received_value += out.get('value', 0)
        
        # Record transaction details
        if is_sender and sent_value > 0:
            sent_transactions.append({
                'value': sent_value,
                'block': tx_block,
                'time': tx_time,
                'fee': tx_fee
            })
            all_transaction_values.append(sent_value)
        
        if is_receiver and received_value > 0:
            received_transactions.append({
                'value': received_value,
                'block': tx_block,
                'time': tx_time
            })
            all_transaction_values.append(received_value)
        
        # Track counterparty addresses for interaction analysis
        all_tx_addresses = extract_all_addresses_from_tx(tx)
        all_tx_addresses.discard(target_address)  # Remove target address
        
        for addr in all_tx_addresses:
            all_counterparty_addresses.append(addr)
            address_interaction_counts[addr] += 1

    # Convert to BTC
    sent_values_btc = [tx['value'] / SATOSHI_TO_BTC for tx in sent_transactions]
    received_values_btc = [tx['value'] / SATOSHI_TO_BTC for tx in received_transactions]
    all_values_btc = [v / SATOSHI_TO_BTC for v in all_transaction_values]
    fees_btc = [f / SATOSHI_TO_BTC for f in all_fees]
    
    # Calculate block intervals
    block_intervals = []
    sent_block_intervals = []
    received_block_intervals = []
    
    if len(block_heights) > 1:
        sorted_blocks = sorted(block_heights)
        for i in range(1, len(sorted_blocks)):
            interval = sorted_blocks[i] - sorted_blocks[i-1]
            block_intervals.append(interval)
    
    # Block intervals for sent transactions
    sent_blocks = sorted([tx['block'] for tx in sent_transactions if tx['block'] > 0])
    if len(sent_blocks) > 1:
        for i in range(1, len(sent_blocks)):
            sent_block_intervals.append(sent_blocks[i] - sent_blocks[i-1])
    
    # Block intervals for received transactions
    received_blocks = sorted([tx['block'] for tx in received_transactions if tx['block'] > 0])
    if len(received_blocks) > 1:
        for i in range(1, len(received_blocks)):
            received_block_intervals.append(received_blocks[i] - received_blocks[i-1])
    
    # Calculate fee shares (fee as percentage of transaction value)
    fee_shares = []
    for tx in sent_transactions:
        if tx['value'] > 0 and tx['fee'] > 0:
            fee_share = (tx['fee'] / tx['value']) * 100
            fee_shares.append(fee_share)
    
    # Also calculate fee shares for all transactions where target was involved
    for tx in transactions:
        tx_fee = tx.get('fee', 0)
        if tx_fee > 0:
            # Find total value moved in this transaction involving target address
            total_value = 0
            for inp in tx.get('inputs', []):
                if inp.get('prev_out') and inp['prev_out'].get('addr') == target_address:
                    total_value += inp['prev_out'].get('value', 0)
            for out in tx.get('out', []):
                if out.get('addr') == target_address:
                    total_value += out.get('value', 0)
            
            if total_value > 0:
                fee_share = (tx_fee / total_value) * 100
                if fee_share not in fee_shares:  # Avoid duplicates
                    fee_shares.append(fee_share)
    
    # Address interaction analysis
    unique_addresses = len(set(all_counterparty_addresses))
    addresses_multiple_interactions = len([addr for addr, count in address_interaction_counts.items() if count > 1])
    
    # Address interaction values (how much transacted with each address)
    address_values = list(address_interaction_counts.values())
    
    # Calculate timestep-related features (approximation using block groupings)
    unique_blocks = len(set(block_heights)) if block_heights else 0
    
    # Build comprehensive features dictionary
    features = {
        # Basic transaction counts
        'num_txs_as_sender': float(len(sent_transactions)),
        'num_txs_as receiver': float(len(received_transactions)),
        'total_txs': float(len(transactions)),
        
        # Block and time features
        'first_block_appeared_in': float(min(block_heights)) if block_heights else 0.0,
        'last_block_appeared_in': float(max(block_heights)) if block_heights else 0.0,
        'lifetime_in_blocks': float(max(block_heights) - min(block_heights)) if len(block_heights) > 1 else 0.0,
        'first_sent_block': float(min(sent_blocks)) if sent_blocks else 0.0,
        'first_received_block': float(min(received_blocks)) if received_blocks else 0.0,
        'num_timesteps_appeared_in': float(unique_blocks),
        
        # BTC transaction value features
        **{f'btc_transacted_{k}': v for k, v in safe_stats(all_values_btc).items()},
        **{f'btc_sent_{k}': v for k, v in safe_stats(sent_values_btc).items()},
        **{f'btc_received_{k}': v for k, v in safe_stats(received_values_btc).items()},
        
        # Fee features
        **{f'fees_{k}': v for k, v in safe_stats(fees_btc).items()},
        
        # Fee share features
        **{f'fees_as_share_{k}': v for k, v in safe_stats(fee_shares).items()},
        
        # Block interval features
        **{f'blocks_btwn_txs_{k}': v for k, v in safe_stats(block_intervals).items()},
        **{f'blocks_btwn_input_txs_{k}': v for k, v in safe_stats(sent_block_intervals).items()},
        **{f'blocks_btwn_output_txs_{k}': v for k, v in safe_stats(received_block_intervals).items()},
        
        # Address interaction features
        'num_addr_transacted_multiple': float(addresses_multiple_interactions),
        **{f'transacted_w_address_{k}': v for k, v in safe_stats(address_values).items()},
        
        # Time step (approximation - this might need refinement based on original dataset)
        'Time step': float(unique_blocks),  # Using unique blocks as proxy for timesteps
    }
    
    # Ensure all expected features are present
    expected_features = [
        'Time step', 'num_txs_as_sender', 'num_txs_as receiver', 'first_block_appeared_in', 
        'last_block_appeared_in', 'lifetime_in_blocks', 'total_txs', 'first_sent_block', 
        'first_received_block', 'num_timesteps_appeared_in', 'btc_transacted_total', 
        'btc_transacted_min', 'btc_transacted_max', 'btc_transacted_mean', 'btc_transacted_median',
        'btc_sent_total', 'btc_sent_min', 'btc_sent_max', 'btc_sent_mean', 'btc_sent_median',
        'btc_received_total', 'btc_received_min', 'btc_received_max', 'btc_received_mean', 
        'btc_received_median', 'fees_total', 'fees_min', 'fees_max', 'fees_mean', 'fees_median',
        'fees_as_share_total', 'fees_as_share_min', 'fees_as_share_max', 'fees_as_share_mean', 
        'fees_as_share_median', 'blocks_btwn_txs_total', 'blocks_btwn_txs_min', 'blocks_btwn_txs_max',
        'blocks_btwn_txs_mean', 'blocks_btwn_txs_median', 'blocks_btwn_input_txs_total', 
        'blocks_btwn_input_txs_min', 'blocks_btwn_input_txs_max', 'blocks_btwn_input_txs_mean',
        'blocks_btwn_input_txs_median', 'blocks_btwn_output_txs_total', 'blocks_btwn_output_txs_min',
        'blocks_btwn_output_txs_max', 'blocks_btwn_output_txs_mean', 'blocks_btwn_output_txs_median',
        'num_addr_transacted_multiple', 'transacted_w_address_total', 'transacted_w_address_min',
        'transacted_w_address_max', 'transacted_w_address_mean', 'transacted_w_address_median'
    ]
    
    # Fill any missing features with 0.0
    for feature in expected_features:
        if feature not in features:
            features[feature] = 0.0
    
    print(f"[TRANSLATOR] SUCCESS: Extracted {len(features)} features")
    print(f"[TRANSLATOR] Non-zero features: {sum(1 for v in features.values() if v != 0.0)}")
    
    return features

def create_enhanced_pattern_features(df):
    """Create enhanced pattern features for ransomware detection - EXACT COPY from training script"""
    
    # 1. Partner Transaction Ratio (connectivity)
    df['partner_transaction_ratio'] = (
        df.get('transacted_w_address_total', 0) / 
        (df.get('total_txs', 1) + 1e-8)
    )
    
    # 2. Activity Density (txs per block)
    df['activity_density'] = (
        df.get('total_txs', 0) / 
        (df.get('lifetime_in_blocks', 1) + 1e-8)
    )
    
    # 3. Transaction Size Variance (volatility)
    df['transaction_size_variance'] = (
        df.get('btc_transacted_max', 0) - df.get('btc_transacted_min', 0)
    ) / (df.get('btc_transacted_mean', 1) + 1e-8)
    
    # 4. Flow Imbalance (money laundering indicator)
    df['flow_imbalance'] = (
        (df.get('btc_sent_total', 0) - df.get('btc_received_total', 0)) / 
        (df.get('btc_transacted_total', 1) + 1e-8)
    )
    
    # 5. Temporal Spread (time pattern)
    df['temporal_spread'] = (
        df.get('last_block_appeared_in', 0) - df.get('first_block_appeared_in', 0)
    ) / (df.get('num_timesteps_appeared_in', 1) + 1e-8)
    
    # 6. Fee Percentile (urgency indicator)
    df['fee_percentile'] = (
        df.get('fees_total', 0) / 
        (df.get('btc_transacted_total', 1) + 1e-8)
    )
    
    # 7. Interaction Intensity (network centrality)
    df['interaction_intensity'] = (
        df.get('num_addr_transacted_multiple', 0) / 
        (df.get('transacted_w_address_total', 1) + 1e-8)
    )
    
    # 8. Value Per Transaction (transaction size)
    df['value_per_transaction'] = (
        df.get('btc_transacted_total', 0) / 
        (df.get('total_txs', 1) + 1e-8)
    )
    
    # 9. RANSOMWARE-SPECIFIC: Burst Activity (rapid txs)
    df['burst_activity'] = (
        df.get('total_txs', 0) * df.get('activity_density', 0)
    )
    
    # 10. RANSOMWARE-SPECIFIC: Mixing Intensity (obfuscation)
    df['mixing_intensity'] = (
        df.get('partner_transaction_ratio', 0) * df.get('interaction_intensity', 0)
    )
    
    return df

def predict_ransomware(address):
    """Complete inference pipeline for ransomware detection."""
    print("====== RANSOMWARE DETECTION INFERENCE PIPELINE ======")
    print(f"Target Address: {address}")
    
    # Check if model exists
    if not os.path.exists(MODEL_FILE):
        print(f"[ERROR] Model file not found: {MODEL_FILE}")
        print("[ERROR] Please ensure the trained model is in the same directory.")
        return None
    
    # Load model and components
    print(f"[INFERENCE] Loading trained model from {MODEL_FILE}...")
    model_data = joblib.load(MODEL_FILE)
    model = model_data['model']
    scaler = model_data['scaler']
    feature_names = model_data['feature_names']
    threshold = model_data['threshold']
    
    print(f"[INFERENCE] Model loaded successfully!")
    print(f"[INFERENCE] Expected features: {len(feature_names)}")
    print(f"[INFERENCE] Detection threshold: {threshold:.3f}")
    
    # Step 1: Fetch transaction data
    transactions = fetch_transactions(address)
    if transactions is None:
        print("[ERROR] Failed to fetch transaction data.")
        return None
    

    # Step 2: Extract base features (56 features - exact same as training)
    feature_dict = build_feature_dict(transactions, address)
    if feature_dict is None:
        print("[ERROR] Failed to extract features.")
        return None
    
    # Step 3: Convert to DataFrame for enhanced feature creation
    df_sample = pd.DataFrame([feature_dict])
    
    # Step 4: Create the 10 enhanced pattern features (EXACT same as training)
    print("[INFERENCE] Creating enhanced pattern features...")

    df_sample = create_enhanced_pattern_features(df_sample)
    
    # Step 5: Ensure feature alignment with training
    # Remove non-feature columns that might be present
    exclude_cols = ['address', 'class']
    available_features = [col for col in df_sample.columns if col not in exclude_cols]
    
    print(f"[INFERENCE] Available features after enhancement: {len(available_features)}")
    print(f"[INFERENCE] Expected features from training: {len(feature_names)}")
    
    # Align features exactly with training
    missing_features = set(feature_names) - set(available_features)
    extra_features = set(available_features) - set(feature_names)
    
    if missing_features:
        print(f"[WARNING] Missing features: {missing_features}")
        # Add missing features with default value 0
        for feature in missing_features:
            df_sample[feature] = 0.0
    
    if extra_features:
        print(f"[WARNING] Extra features (will be ignored): {extra_features}")
    
    # Select only the features used in training, in the same order
    X_inference = df_sample[feature_names]

    print(f"HELLO {feature_names}")
    
    
    print(f"[INFERENCE] Final feature vector shape: {X_inference.shape}")
    print(f"[INFERENCE] Feature alignment: {'✅ PERFECT' if X_inference.shape[1] == len(feature_names) else '❌ MISMATCH'}")
    
    # Step 6: Scale features using the same scaler from training
    print("[INFERENCE] Scaling features...")
    X_scaled = scaler.transform(X_inference)
    print(f"HELLO {X_scaled}")
    
    
    # Step 7: Make prediction
    print("[INFERENCE] Making prediction...")
    prediction_proba = model.predict_proba(X_scaled)[0, 1]  # Probability of being illicit
    prediction_binary = int(prediction_proba >= threshold)
    
    # Step 8: Return results
    result = {
        'address': address,
        'ransomware_probability': float(prediction_proba),
        'is_ransomware': bool(prediction_binary),
        'confidence_level': 'HIGH' if abs(prediction_proba - 0.5) > 0.3 else 'MEDIUM' if abs(prediction_proba - 0.5) > 0.1 else 'LOW',
        'threshold_used': float(threshold),
        'feature_count': len(feature_names),
        'transactions_analyzed': len(transactions)
    }
    
    return result

def main(address):
    """Main inference function."""
    result = predict_ransomware(address)
    
    if result is None:
        print("\n[FAILED] Could not complete ransomware detection.")
        return
    
    print("\n" + "="*60)
    print("🎯 RANSOMWARE DETECTION RESULTS")
    print("="*60)
    print(f"Address: {result['address']}")
    print(f"Ransomware Probability: {result['ransomware_probability']:.4f}")
    print(f"Classification: {'🚨 RANSOMWARE DETECTED' if result['is_ransomware'] else '✅ LEGITIMATE'}")
    print(f"Confidence Level: {result['confidence_level']}")
    print(f"Detection Threshold: {result['threshold_used']:.3f}")
    print(f"Transactions Analyzed: {result['transactions_analyzed']}")
    print(f"Features Used: {result['feature_count']}")
    
    if result['is_ransomware']:
        print("\n⚠️  WARNING: This address shows patterns consistent with ransomware activity!")
        print("   Recommended actions:")
        print("   • Flag for manual review")
        print("   • Enhanced monitoring")
        print("   • Compliance reporting if required")
    else:
        print(f"\n✅ This address appears to be legitimate based on transaction patterns.")
        if result['ransomware_probability'] > 0.3:
            print("   Note: Moderate risk score - consider additional verification.")
    
    print("="*60)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Bitcoin ransomware detection inference.")
    parser.add_argument("address", type=str, help="The Bitcoin address to analyze.")
    args = parser.parse_args()
    
    main(args.address)