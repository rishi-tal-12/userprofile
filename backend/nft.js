import Moralis from 'moralis';
import dotenv from 'dotenv';
dotenv.config();

let totalnfts;
let requirednft=[];
try {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY
  });

  const responsenft = await Moralis.EvmApi.nft.getWalletNFTs({
		chain: "0x1",
		format: "decimal",
		normalizeMetadata: true,
		mediaItems: false,
		address: "0xffff142f3224bc363c46f47916f23877b90ffe8d",
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