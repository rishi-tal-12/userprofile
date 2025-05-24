import Moralis from 'moralis';

 async function getuserdetails() {

let requireddefi=[];

  await Moralis.start({
    apiKey: "apikey"
  });

try {

  const responsedefi = await Moralis.EvmApi.wallets.getDefiPositionsSummary({
    "chain": "0x1",
    "address": ""
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


let requirednetworth_usd;

try {

  const responsenetworth = await Moralis.EvmApi.wallets.getWalletNetWorth({
    "excludeSpam": true,
    "excludeUnverifiedContracts": true,
    "maxTokenInactivity": 1,
    "minPairSideLiquidityUsd": 1000,
    "address": ""
  });

 requirednetworth_usd=responsenetworth.raw.total_networth_usd;

  console.log(responsenetworth.raw);
} catch (e) {
  console.error(e);
}


let totalnfts;
let requirednft=[];
try {

  const responsenft = await Moralis.EvmApi.nft.getWalletNFTs({
    "chain": "0x1",
    "format": "decimal",
    "normalizeMetadata": true,
    "mediaItems": false,
    "address": ""
  });
  
  totalnfts=responsenft.raw.result.length;
 requirednft=responsenft.raw.result.map((item)=>{
  return{
    name:item.name,
    verified:item.verified_collection,
    rarity:item.rarity_percentage,
    floor_price:item.floor_price_usd
  }
 });
  
  console.log(responsenft.raw);
} catch (e) {
  console.error(e);
}


let requiredpnl;

try {

  const responsepnl = await Moralis.EvmApi.wallets.getWalletProfitabilitySummary({
    "chain": "0x1",
    "address": ""
  });

   requiredpnl={ 
      total_profit_usd: responsepnl.raw.total_realized_profit_usd,
      total_profit_perecntage: responsepnl.raw.total_realized_profit_percentage
};

  console.log(responsepnl.raw);
} catch (e) {
  console.error(e);
}

let requiredtoken =[];
let totaltokens;

try {

  const responsetoken = await Moralis.EvmApi.token.getWalletTokenBalances({
    "chain": "0x1",
    "address": ""
  });
  totaltokens=responsetoken.raw.length;
  requiredtoken= responsetoken.raw.map((item)=>{
    return{
      token_name:item.name,
      token_balance:item.balance/10**(item.decimals)
    }
  });

  console.log(responsetoken.raw);
} catch (e) {
  console.error(e);
}

console.log(requireddefi);
console.log(totalnfts);
console.log(requirednft);
console.log(requiredpnl);
console.log(totaltokens);
console.log(requiredtoken);
console.log(requirednetworth_usd);

let address="";

return{
    useraddress:address,
    userdefi:requireddefi,
    totalusernft:totalnfts,
    totalusernftinfo:requirednft,
    totalpnl:requiredpnl,
    totalusertokens:totaltokens,
    totalusertokeninfo:requiredtoken,
    totalusernetworth:requirednetworth_usd
};
 }
 export{getuserdetails};

