import { Request, Response } from "express";

export abstract class Controller {
  protected handleRequest(
    handler: (req: Request, res: Response) => Promise<void>
  ) {
    return async (req: Request, res: Response) => {
      try {
        await handler(req, res);
      } catch (error: any) {
        console.error("Error details:", error);
        res.status(500).json({ message: error.message || "An error occurred" });
      }
    };
  }
}
