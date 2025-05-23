import Moralis from 'moralis';

let requirednetworth_usd;

try {
  await Moralis.start({
    apiKey: "apikey"
  });

  const responsenetworth = await Moralis.EvmApi.wallets.getWalletNetWorth({
    "excludeSpam": true,
    "excludeUnverifiedContracts": true,
    "maxTokenInactivity": 1,
    "minPairSideLiquidityUsd": 1000,
    "address": "address"
  });

 requirednetworth_usd=responsenetworth.raw.total_networth_usd;

  console.log(responsenetworth.raw);
} catch (e) {
  console.error(e);
}

export {requirednetworth_usd};