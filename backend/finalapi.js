import express from "express";
import { GoogleGenAI, Modality } from "@google/genai";
import { generateWalletPersonaScores } from "./deepseek.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(express.json());

// Reuse your prompt generator function
function generateImagePrompt(walletPersona) {
	const attributes = {};
	walletPersona.attributes.forEach((attr) => {
		attributes[attr.name.toLowerCase()] = attr;
	});

	const cond = (test, ifTrue, ifFalse) => (test ? ifTrue : ifFalse);

	return `Create a highly detailed 3D rendered image of a ${
		walletPersona.personalityArchetype.name
	} character in cyberpunk-fantasy style. Key features:
    - Theme: ${walletPersona.personalityArchetype.description}
    - Appearance: ${Math.round(attributes.strength.value / 10)}-limbed ${cond(
		attributes.constitution.value > 50,
		"armored",
		"vulnerable"
	)} figure
    - Style: ${cond(
		attributes.charisma.value > 50,
		"flamboyant",
		"utilitarian"
	)} accessories
    - Background: Floating ${getTopThreeAttributes(
		walletPersona.attributes
	)} tokens with ${cond(
		attributes.wisdom.value > 50,
		"complex diagrams",
		"blank scrolls"
	)}
    - Color: Dominant ${getIntelligenceColor(attributes.intelligence.value)}
    Rendered in 8K with cinematic lighting, symbolic blockchain metaphors.`;
}

function getTopThreeAttributes(attributes) {
	return attributes
		.sort((a, b) => b.value - a.value)
		.slice(0, 3)
		.map((attr) => attr.name.toLowerCase())
		.join("/");
}

function getIntelligenceColor(value) {
	if (value > 70) return "cool analytical blues";
	if (value < 30) return "hot speculative reds";
	return "neutral grays";
}

app.post("/api/persona", async (req, res) => {
	const { address } = req.body;

	if (!address) {
		return res.status(400).json({ error: "Address is required" });
	}

	try {
		// 1. Get persona scores
		const personaScores = await generateWalletPersonaScores(address);
		if (!personaScores) {
			return res
				.status(500)
				.json({ error: "Could not generate persona scores" });
		}

		// 2. Generate image prompt
		const imagePrompt = generateImagePrompt(personaScores);

		// 3. Call Gemini API for image generation
		const geminiResponse = await ai.models.generateContent({
			model: "gemini-2.0-flash-preview-image-generation",
			contents: imagePrompt,
			config: {
				responseModalities: [Modality.TEXT, Modality.IMAGE],
			},
		});

		// 4. Extract image and text
		let generatedText = "";
		let imageBase64 = "";

		for (const part of geminiResponse.candidates[0].content.parts) {
			if (part.text) {
				generatedText = part.text;
			} else if (part.inlineData) {
				imageBase64 = part.inlineData.data;
			}
		}

		// 5. Return combined response
		res.json({
			persona: personaScores,
			visualization: {
				prompt: imagePrompt,
				image: imageBase64,
				mimeType: "image/png",
				model: "gemini-2.0-flash",
				generatedText: generatedText,
			},
		});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({
			error: "Error in generating persona",
			details: error.message,
		});
	}
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
