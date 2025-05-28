import { getuserdetails } from "./combined.js"; // Assuming combined.js contains getuserdetails
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: process.env.DEEPSEEK_API_KEY,
});

async function generateWalletPersonaScores(address) {
	// Ensure address is valid before proceeding
	if (!address) {
		console.error(
			"Error: generateWalletPersonaScores called with undefined address."
		);
		return "Could not generate persona scores: Invalid address provided.";
	}

	let userdetails;
	try {
		userdetails = await getuserdetails(address);
	} catch (error) {
		console.error("Error fetching user details from Moralis:", error);
		return "Could not generate persona scores: Failed to fetch wallet data.";
	}

	// Defensive checks for userdetails and its nested properties
	const userDefi = userdetails?.userdefi
		? JSON.stringify(userdetails.userdefi)
		: "No DeFi activity";
	const totalUserNft = userdetails?.totalusernft ?? 0;
	const totalUserNftInfoNames =
		userdetails?.totalusernftinfo?.map((n) => n.name).join(", ") ||
		"No NFTs";
	const totalUserTokens = userdetails?.totalusertokens ?? 0;
	const totalUserNetworth = userdetails?.totalusernetworth ?? 0;
	const totalProfitPercentage =
		userdetails?.totalpnl?.total_profit_perecntage ?? "N/A";

	const prompt = `
    Analyze this Ethereum wallet activity and create a gamified persona with scored traits (0-100 scale) and brief descriptors. Use this format:

    **Wallet Persona Scores**

    1. Dexterity: [Score] (Description of trading frequency/speed)
    2. Wisdom: [Score] (Description of governance/DAO participation)
    3. Strength: [Score] (Description of portfolio size/impact)
    4. Constitution: [Score] (Description of risk management/diversification)
    5. Charisma: [Score] (Description of NFT/social presence)
    6. Intelligence: [Score] (Description of DeFi strategy complexity)

    Scoring Guidelines:
    - 90+ = Exceptional/Professional level
    - 75-89 = Advanced/Enthusiast level
    - 50-74 = Intermediate/Developing
    - 25-49 = Beginner/Occasional
    - <25 = Minimal/Inactive

    Base scores on these wallet metrics:
    - DEFI ACTIVITY: ${userDefi}
    - NFT HOLDINGS: ${totalUserNft} 
    - NFTs (${totalUserNftInfoNames})
    - TOKEN PORTFOLIO: ${totalUserTokens} tokens worth $${totalUserNetworth}
    - PNL: ${totalProfitPercentage}% profit

    Provide concise 3-5 word explanations in parentheses after each score that capture the essence of that trait for this wallet.
    ALWAYS RETURN AS THE FORMAT IN THE EXAMPLE PROVIDED BELOW & REMOVE ANY TEXT HIGHLIGHTING OR BOLD:
{
  "attributes": [
    {
      "id": 1,
      "name": "Dexterity",
      "value": 30,
      "parentheticalDescription": "Infrequent DeFi activity",
      "description": "Minimal liquidity provision and staking with no active trading history."
    },
    {
      "id": 2,
      "name": "Wisdom",
      "value": 15,
      "parentheticalDescription": "No governance engagement",
      "description": "Holds Lido/Aave positions but zero participation in DAO governance."
    },
    {
      "id": 3,
      "name": "Strength",
      "value": 85,
      "parentheticalDescription": "High-value portfolio",
      "description": "$1.3M token dominance despite negligible DeFi allocations."
    },
    {
      "id": 4,
      "name": "Constitution",
      "value": 60,
      "parentheticalDescription": "Safety-first diversification",
      "description": "8-token spread with ultra-conservative exposure (<$2 in DeFi)."
    },
    {
      "id": 5,
      "name": "Charisma",
      "value": 25,
      "parentheticalDescription": "Niche protocol collectibles",
      "description": "Specialized stETH/wBTC-related NFTs lacking mainstream appeal."
    },
    {
      "id": 6,
      "name": "Intelligence",
      "value": 45,
      "parentheticalDescription": "Basic DeFi operations",
      "description": "Limited to staking/supplying with no advanced strategies."
    }
  ],
  "personalityArchetype": {
    "name": "The Passive Custodian",
    "description": "A high-net-worth holder ($1.3M) prioritizing capital preservation over active DeFi participation. Maintains security through minimal protocol exposure and broad asset distribution, with 0% profit/loss reflecting ultra-cautious management"
}
}
    `;

	try {
		const data = await openai.chat.completions.create({
			model: "deepseek/deepseek-r1:free",
			messages: [
				{
					role: "system",
					content:
						"You are a Web3 analytics expert that creates gamified wallet personas based on on-chain activity.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
		});

		const llmResponseContent = data.choices[0].message.content;

		// Parse the JSON string into a JavaScript object before returning
		try {
			return JSON.parse(llmResponseContent);
		} catch (parseError) {
			console.error("Error parsing LLM response JSON:", parseError);
			return "Could not generate persona scores: LLM returned invalid JSON.";
		}
	} catch (error) {
		console.error("Error calling DeepSeek API:", error);
		return "Could not generate persona scores at this time.";
	}
}


export { generateWalletPersonaScores };
