import { Router, Request, Response } from "express";
import { loginAccountDto } from "../dto/accountController/loginAccountDto";
import { createAccountDTO } from "../dto/accountController/createAccountDto";
import { createAccountService, inviteToSignupService, loginAccountService } from "../services/accountServices";
import { isInvited } from "../guards/isInvited";
import { cookieOptions, redis } from "../app";
import { isSignupValid } from "../guards/isSignupValid";
import { inviteToSignupDto } from "../dto/accountController/inviteToSignupDto";
import path from 'path';

export const accountController = Router();

accountController.post('/invite', async (req: Request, res: Response): Promise<any> => {
    return res.sendStatus(await inviteToSignupService(req.body as inviteToSignupDto));
}).get('/invite', isInvited);

accountController.get('/sign-up', isSignupValid, (_: Request, res: Response): any => {    
    return res.status(200).sendFile(path.join(__dirname, '../testPages/signup.html'));
});

accountController.post('/loginAccount', async (req: Request, res: Response): Promise<any> => {
    const response = await loginAccountService(req.body as loginAccountDto) as any;

    if(response.status !== 200) 
        return res.status(response.status).json({ message: 'Login Invalid' });

    res.cookie('rtk', response.rtk, cookieOptions);
    return res.status(response.status).json({ message: 'Login Successful' });
});

accountController.post('/logoutAccount', async (req: Request, res: Response): Promise<any> => {

    try {

        await redis.db1.del(req.sessionID);
        res.clearCookie('rtk');
        res.clearCookie('sid');

    } catch {
        
        return res.sendStatus(500);
    }

    return res.status(200).json({ message: 'Cookie cleared, logged out successfully' });
    
});

accountController.post('/createAccount', async (req: Request, res: Response): Promise<any> => {
    return res.sendStatus(await createAccountService(req.body as createAccountDTO)); 
});