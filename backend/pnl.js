import Moralis from 'moralis';
import dotenv from 'dotenv';
dotenv.config();

let requiredpnl;

try {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY
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