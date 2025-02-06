import { Router, Request, Response } from "express";
import { loginAccountDto } from "../dto/accountController/loginAccountDto";
import { createAccountDTO } from "../dto/accountController/createAccountDto";
import { createAccountService, inviteToSignupService, loginAccountService } from "../services/accountServices";
import { cookieOptions, redis } from "../app";
import { inviteToSignupDto } from "../dto/accountController/inviteToSignupDto";

export const accountController = Router();

accountController.post('/invite', async (req: Request, res: Response): Promise<any> => {
    return res.sendStatus(await inviteToSignupService(req.body as inviteToSignupDto));
});

accountController.post('/loginAccount', async (req: Request, res: Response): Promise<any> => {
    //const response = await loginAccountService(req.body as loginAccountDto) as any;
    const response = await loginAccountService(req.body as loginAccountDto, req.sessionID) as any; // THIS ONE IS TEMPORARY

    if(response.status !== 200) 
        return res.status(response.status);

    res.cookie('atk', response.atk, cookieOptions); // TEMPORARY
    return res.cookie('rtk', response.rtk, cookieOptions).sendStatus(response.status);
});

accountController.post('/logoutAccount', async (req: Request, res: Response): Promise<any> => {

    try {

        await redis.con.del(req.sessionID);

    } catch {
        
        return res.sendStatus(500);
    }

    return res.clearCookie('rtk').clearCookie('atk').status(200).json({ message: 'Cookie cleared, logged out successfully' });
    
});

accountController.post('/createAccount', async (req: Request, res: Response): Promise<any> => {
    return res.sendStatus(await createAccountService(req.body as createAccountDTO)); 
});