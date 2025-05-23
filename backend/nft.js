import Moralis from 'moralis';

let totalnfts;
let requirednft=[];
try {
  await Moralis.start({
    apiKey: "apikey"
  });

  const responsenft = await Moralis.EvmApi.nft.getWalletNFTs({
    "chain": "0x1",
    "format": "decimal",
    "normalizeMetadata": true,
    "mediaItems": false,
    "address": "address"
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

export {totalnfts,requirednft}