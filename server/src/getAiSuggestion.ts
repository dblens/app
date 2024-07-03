import { Request, Response } from "express";
import OpenAI from "openai";

interface SQLFix {
  query: string;
  reason: string;
}

// Remove triple backticks if they are part of the input

function parseJsonSafely(jsonString: string): SQLFix | null {
  const cleanedJsonString = jsonString.replace(
    /^```json\s*([\s\S]*)```$/,
    "$1"
  );
  try {
    const parsed: SQLFix = JSON.parse(cleanedJsonString);
    return parsed;
  } catch (error) {
    console.error("Failed to parse JSON string:", error);
    return null;
  }
}

export const getAiSuggestionHandler = async (req: Request, res: Response) => {
  const { systemInstructions, query, error } = req.body;
  if (!systemInstructions || !query || !error) {
    const missingParams = [];
    if (!systemInstructions) missingParams.push("systemInstructions");
    if (!query) missingParams.push("query");
    if (!error) missingParams.push("error");
    return res.status(400).json({
      message: `Missing required parameters: ${missingParams.join(", ")}`,
    });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
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
      if (
        response &&
        response &&
        response.choices &&
        response.choices[0] &&
        response.choices[0].message &&
        response.choices[0].message.content
      ) {
        console.log("AI response:", response.choices[0].message.content);
        const result = parseJsonSafely(response.choices[0].message.content);
        if (result === null) throw new Error("Failed to parse JSON");
        else return res.status(200).json(result);
      }
      throw new Error("No response from AI");
    } catch (error) {
      console.error("Error parsing response:", error);
      return res.status(500).json({
        message: "Error parsing response",
        error,
      });
    }
  } catch (error: any) {
    console.error("Error executing queries:", error);
    res
      .status(500)
      .json({ message: "Error executing queries", error: error?.message });
  }
};
