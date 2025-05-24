import { requireddefi } from "./defi.js";
import {totalnfts, requirednft } from "./nft.js";
import { requiredpnl } from "./pnl.js";
import { totaltokens,requiredtoken } from "./token.js";
import { requirednetworth_usd } from "./networth.js";

let address = "0xffff142f3224bc363c46f47916f23877b90ffe8d";

const userdetails = {
    useraddress:address,
    userdefi:requireddefi,
    totalusernft:totalnfts,
    totalusernftinfo:requirednft,
    totalpnl:requiredpnl,
    totalusertokens:totaltokens,
    totalusertokeninfo:requiredtoken,
    totalusernetworth:requirednetworth_usd
}
console.log(userdetails);
export {userdetails};