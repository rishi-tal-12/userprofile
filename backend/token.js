import Moralis from 'moralis';

let requiredtoken =[];
let totaltokens;

try {
  await Moralis.start({
    apiKey: "apikey"
  });

  const responsetoken = await Moralis.EvmApi.token.getWalletTokenBalances({
    "chain": "0x1",
    "address": "address"
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

export {totaltokens,requiredtoken};