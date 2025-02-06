import { Router, Request, Response } from "express";
import { companyServices } from "../services/companyServices";
export const companyController = Router();
companyController


.post('/getCompanyTheme', async (req: Request, res: Response): Promise<any> => {
    const response = await companyServices(req.cookies['atk']);
    if(response.status !== 200)
        return res.sendStatus(response.status);

    return res.status(response.status).json(response.result);
});