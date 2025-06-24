import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Ambil saldo Bitcoin dari mempool.space mainnet API.
 * @param {string} address - Alamat Bitcoin (format mainnet: 1..., 3..., bc1...)
 * @returns {Promise<number>} - Saldo dalam satuan satoshi
 */
export async function getBitcoinBalance(address) {
  const endpoint = `https://mempool.space/testnet4/api/address/${address}`; // Testnet
  // const endpoint = `https://mempool.space/api/address/${address}`; // Mainnet

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const funded = data.chain_stats.funded_txo_sum;
    const spent = data.chain_stats.spent_txo_sum;

    const balanceSatoshi = funded - spent;
    const balanceBTC = balanceSatoshi / 100_000_000;

    return balanceBTC;
  } catch (error) {
    console.error("Gagal mengambil saldo:", error);
    return null;
  }
}

export function convertBTCtoSatoshi(btcString) {
  const btc = parseFloat(btcString);
  const satoshi = Math.round(btc * 100_000_000);
  return satoshi;
}
