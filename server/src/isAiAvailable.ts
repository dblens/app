import { Request, Response } from "express";

export const isAiAvailableHandler = async (_: Request, res: Response) => {
  res.status(200).json({
    status:
      process.env.OPENAI_API_KEY !== undefined ? "AVAILABLE" : "UNAVAILABLE",
  });
};
