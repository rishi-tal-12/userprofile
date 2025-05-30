import express from "express";
import { GoogleGenAI, Modality } from "@google/genai";
import { generateWalletPersonaScores } from "./deepseek.js";
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(express.json());
app.use(cors());
// Fixed prompt generator function with proper error handling
function generateImagePrompt(walletPersona) {
	// Add null/undefined checks
	if (
		!walletPersona ||
		!walletPersona.attributes ||
		!Array.isArray(walletPersona.attributes)
	) {
		console.error("Invalid walletPersona structure:", walletPersona);
		throw new Error("Invalid wallet persona data structure");
	}

	const attributes = {};

	// Safe forEach with error handling
	try {
		walletPersona.attributes.forEach((attr) => {
			if (attr && attr.name && typeof attr.value !== "undefined") {
				attributes[attr.name.toLowerCase()] = attr;
			}
		});
	} catch (error) {
		console.error("Error processing attributes:", error);
		throw new Error("Failed to process wallet persona attributes");
	}

	const cond = (test, ifTrue, ifFalse) => (test ? ifTrue : ifFalse);

	// Add default values and safe property access
	const personalityArchetype = walletPersona.personalityArchetype || {
		name: "Unknown",
		description: "Mysterious digital entity",
	};

	const strengthValue = attributes.strength?.value || 50;
	const constitutionValue = attributes.constitution?.value || 50;
	const charismaValue = attributes.charisma?.value || 50;
	const wisdomValue = attributes.wisdom?.value || 50;
	const intelligenceValue = attributes.intelligence?.value || 50;

	return `Create a highly detailed 3D rendered image of a ${
		personalityArchetype.name
	} character in cyberpunk-fantasy style. Key features:
    - Theme: ${personalityArchetype.description}
    - Appearance: ${Math.round(strengthValue / 10)}-limbed ${cond(
		constitutionValue > 50,
		"armored",
		"vulnerable"
	)} figure
    - Style: ${cond(
		charismaValue > 50,
		"flamboyant",
		"utilitarian"
	)} accessories
    - Background: Floating ${getTopThreeAttributes(
		walletPersona.attributes
	)} tokens with ${cond(
		wisdomValue > 50,
		"complex diagrams",
		"blank scrolls"
	)}
    - Color: Dominant ${getIntelligenceColor(intelligenceValue)}
    Rendered in 8K with cinematic lighting, symbolic blockchain metaphors.`;
}

function getTopThreeAttributes(attributes) {
	if (!Array.isArray(attributes) || attributes.length === 0) {
		return "default/basic/simple";
	}

	return (
		attributes
			.filter(
				(attr) => attr && attr.name && typeof attr.value !== "undefined"
			)
			.sort((a, b) => (b.value || 0) - (a.value || 0))
			.slice(0, 3)
			.map((attr) => attr.name.toLowerCase())
			.join("/") || "default/basic/simple"
	);
}

function getIntelligenceColor(value) {
	const numValue = Number(value) || 50;
	if (numValue > 70) return "cool analytical blues";
	if (numValue < 30) return "hot speculative reds";
	return "neutral grays";
}

app.post("/api/persona", async (req, res) => {
	const { address } = req.body;

	if (!address) {
		return res.status(400).json({ error: "Address is required" });
	}

	try {
		console.log(`Processing request for address: ${address}`);

		// 1. Get persona scores with better error handling
		const personaScores = await generateWalletPersonaScores(address);

		if (!personaScores) {
			console.error("No persona scores returned");
			return res.status(500).json({
				error: "Could not generate persona scores",
				details:
					"The persona generation service returned null or undefined",
			});
		}

		console.log(
			"Generated Persona Scores:",
			JSON.stringify(personaScores, null, 2)
		);

		// 2. Generate image prompt with error handling
		let imagePrompt;
		try {
			imagePrompt = generateImagePrompt(personaScores);
		} catch (promptError) {
			console.error("Error generating image prompt:", promptError);
			return res.status(500).json({
				error: "Failed to generate image prompt",
				details: promptError.message,
				persona: personaScores, // Still return persona data
			});
		}

		// 3. Call Gemini API for image generation
		let geminiResponse;
		try {
			geminiResponse = await ai.models.generateContent({
				model: "gemini-2.0-flash-preview-image-generation",
				contents: imagePrompt,
				config: {
					responseModalities: [Modality.TEXT, Modality.IMAGE],
				},
			});
		} catch (geminiError) {
			console.error("Gemini API error:", geminiError);
			return res.status(500).json({
				error: "Failed to generate image",
				details: geminiError.message,
				persona: personaScores,
				prompt: imagePrompt,
			});
		}

		// 4. Extract image and text safely
		let generatedText = "";
		let imageBase64 = "";

		try {
			if (geminiResponse?.candidates?.[0]?.content?.parts) {
				for (const part of geminiResponse.candidates[0].content.parts) {
					if (part.text) {
						generatedText = part.text;
					} else if (part.inlineData) {
						imageBase64 = part.inlineData.data;
					}
				}
			}
		} catch (extractError) {
			console.error("Error extracting response data:", extractError);
			// Continue without failing completely
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
		console.error("Unexpected error:", error);
		res.status(500).json({
			error: "Unexpected error in generating persona",
			details: error.message,
			stack:
				process.env.NODE_ENV === "development"
					? error.stack
					: undefined,
		});
	}
});

// Health check endpoint
app.get("/health", (req, res) => {
	res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
	console.error("Unhandled error:", error);
	res.status(500).json({
		error: "Internal server error",
		details:
			process.env.NODE_ENV === "development" ? error.message : undefined,
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
