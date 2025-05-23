import { requireddefi } from "./defi";
import {totalnfts, requirednft } from "./nft";
import { requiredpnl } from "./pnl";
import { totaltokens,requiredtoken } from "./token";
import { requirednetworth_usd } from "./networth";

let address;

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

export {userdetails};