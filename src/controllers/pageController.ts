import { Router, Request, Response } from "express";
import path from 'path';

import { isAuthenticated } from "../guards/isAuthenticated";
import { hasToken } from "../guards/hasToken";
import { isSignupValid } from "../guards/isSignupValid";
import { isInvited } from "../guards/isInvited";

export const pageController = Router();

pageController.get('/login', hasToken, (req: Request, res: Response): void => {
    if(req.cookies['unauthorized'])
        return res.clearCookie('unauthorized').status(401).sendFile(path.join(__dirname, '../testPages/login.html'));
        
    return res.sendFile(path.join(__dirname, '../testPages/login.html'));
});

pageController.get('/invite', isInvited);

pageController.get('/sign-up', isSignupValid, (_: Request, res: Response): any => {    
    return res.status(200).sendFile(path.join(__dirname, '../../pages/signup.html'));
});

pageController.get('/chat', isAuthenticated, (_: Request, res: Response): any => {
    return res.status(200).sendFile(path.join(__dirname, '../../pages/chat.html'));
});

pageController.get(['/', 'users', 'notification', 'settings', 'profile'], isAuthenticated, (req: Request, res: Response): any => {
    return res.status(200).sendFile(path.join(__dirname, '../../public/browser/index.html'));
});