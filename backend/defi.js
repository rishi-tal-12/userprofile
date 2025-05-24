import Moralis from 'moralis';
import dotenv from 'dotenv';

dotenv.config();

let requireddefi=[];
try {
  await Moralis.start({
		apiKey: process.env.MORALIS_API_KEY,
  });

  const responsedefi = await Moralis.EvmApi.wallets.getDefiPositionsSummary({
    "chain": "0x1",
    "address": "address"
  });

  requireddefi= responsedefi.raw.map((item)=>{
    return{
      protocol_name:item.protocol_name,
      position:item.position.label,
      position_balance_usd:item.position.balance_usd
    }
  })

  console.log(responsedefi.raw);
} catch (e) {
  console.error(e);
}

export {requireddefi}