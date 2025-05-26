
import Moralis from "moralis";


async function getuserdetails(address) {
	let requireddefi = [];

	await Moralis.start({
		apiKey: process.env.MORALIS_API_KEY,
	});

	try {
		const responsedefi =
			await Moralis.EvmApi.wallets.getDefiPositionsSummary({
				chain: "0x1",
				address: address,
			});

		requireddefi = responsedefi.raw.map((item) => {
			return {
				protocol_name: item.protocol_name,
				position: item.position.label,
				position_balance_usd: item.position.balance_usd,
			};
		});

	} catch (e) {
		console.error(e);
	}

	let requirednetworth_usd;

	try {
		const responsenetworth = await Moralis.EvmApi.wallets.getWalletNetWorth(
			{
				excludeSpam: true,
				excludeUnverifiedContracts: true,
				maxTokenInactivity: 1,
				minPairSideLiquidityUsd: 1000,
				address: "0x397883FEC864F3D5F6586fFad096128259d91f2E",
			}
		);

		requirednetworth_usd = responsenetworth.raw.total_networth_usd;

	} catch (e) {
		console.error(e);
	}

	let totalnfts;
	let requirednft = [];
	try {
		const responsenft = await Moralis.EvmApi.nft.getWalletNFTs({
			chain: "0x1",
			format: "decimal",
			normalizeMetadata: true,
			mediaItems: false,
			address: address,
		});

		totalnfts = responsenft.raw.result.length;
		requirednft = responsenft.raw.result.map((item) => {
			return {
				name: item.name,
				contract_type: item.contract_type,
				collection_logo: item.collection_logo,
				verified: item.verified_collection,
				rarity: item.rarity_percentage,
				floor_price: item.floor_price_usd,
				
			};
		});

	} catch (e) {
		console.error(e);
	}

	let requiredpnl;

	try {
		const responsepnl =
			await Moralis.EvmApi.wallets.getWalletProfitabilitySummary({
				chain: "0x1",
				address: address,
			});

		requiredpnl = {
			total_profit_usd: responsepnl.raw.total_realized_profit_usd,
			total_profit_perecntage:
				responsepnl.raw.total_realized_profit_percentage,
		};

	} catch (e) {
		console.error(e);
	}

	let requiredtoken = [];
	let totaltokens;

	try {
		const responsetoken = await Moralis.EvmApi.token.getWalletTokenBalances(
			{
				chain: "0x1",
				address: address,
			}
		);
		totaltokens = responsetoken.raw.length;
		requiredtoken = responsetoken.raw.map((item) => {
			return {
				token_name: item.name,
				token_symbol: item.symbol,
				token_logo: item.logo,
				token_balance: item.balance / 10 ** item.decimals,
			};
		});

	} catch (e) {
		console.error(e);
	}


	return {
		useraddress: address,
		userdefi: requireddefi,
		totalusernft: totalnfts,
		totalusernftinfo: requirednft,
		totalpnl: requiredpnl,
		totalusertokens: totaltokens,
		totalusertokeninfo: requiredtoken,
		totalusernetworth: requirednetworth_usd,
	};
}
export { getuserdetails };
