import { Request, Response, NextFunction } from "express";

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {

    next();
}