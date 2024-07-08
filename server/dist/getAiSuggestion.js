"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAiSuggestionHandler = void 0;
const openai_1 = require("openai");
// Remove triple backticks if they are part of the input
function parseJsonSafely(jsonString) {
    const cleanedJsonString = jsonString.replace(/^```json\s*([\s\S]*)```$/, "$1");
    try {
        const parsed = JSON.parse(cleanedJsonString);
        return parsed;
    }
    catch (error) {
        console.error("Failed to parse JSON string:", error);
        return null;
    }
}
const getAiSuggestionHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { systemInstructions, query, error } = req.body;
    if (!systemInstructions || !query || !error) {
        const missingParams = [];
        if (!systemInstructions)
            missingParams.push("systemInstructions");
        if (!query)
            missingParams.push("query");
        if (!error)
            missingParams.push("error");
        return res.status(400).json({
            message: `Missing required parameters: ${missingParams.join(", ")}`,
        });
    }
    try {
        const openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const response = yield openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: JSON.stringify(systemInstructions),
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({ query, error }),
                        },
                    ],
                },
            ],
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        try {
            if (response &&
                response &&
                response.choices &&
                response.choices[0] &&
                response.choices[0].message &&
                response.choices[0].message.content) {
                console.log("AI response:", response.choices[0].message.content);
                const result = parseJsonSafely(response.choices[0].message.content);
                if (result === null)
                    throw new Error("Failed to parse JSON");
                else
                    return res.status(200).json(result);
            }
            throw new Error("No response from AI");
        }
        catch (error) {
            console.error("Error parsing response:", error);
            return res.status(500).json({
                message: "Error parsing response",
                error,
            });
        }
    }
    catch (error) {
        console.error("Error executing queries:", error);
        res
            .status(500)
            .json({ message: "Error executing queries", error: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.getAiSuggestionHandler = getAiSuggestionHandler;
