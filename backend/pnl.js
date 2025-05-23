import Moralis from 'moralis';

let requiredpnl;

try {
  await Moralis.start({
    apiKey: "apikey"
  });

  const responsepnl = await Moralis.EvmApi.wallets.getWalletProfitabilitySummary({
    "chain": "0x1",
    "address": "address"
  });

   requiredpnl={ 
      total_profit_usd: responsepnl.raw.total_realized_profit_usd,
      total_profit_perecntage: responsepnl.raw.total_realized_profit_percentage
};

  console.log(responsepnl.raw);
} catch (e) {
  console.error(e);
}

export {requiredpnl};