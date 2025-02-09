import { Router, Request, Response } from "express";
import path from 'path';

import { isAuthenticated } from "../guards/isAuthenticated";
import { hasToken } from "../guards/hasToken";
import { isSignupValid } from "../guards/isSignupValid";
import { isInvited } from "../guards/isInvited";
import { isAuthorized } from "../guards/isAuthorized";

export const pageController = Router();
pageController

.get('/login', hasToken, (req: Request, res: Response): void => {
    if(req.cookies['unauthorized'])
        return res.clearCookie('unauthorized').status(401).sendFile(path.join(__dirname, '../../public/browser/index.html'));

    return res.sendFile(path.join(__dirname, '../../public/browser/index.html'));
})

.get('/invite', isInvited)

.get('/sign-up', isSignupValid, (_: Request, res: Response): any => {    
    return res.status(200).sendFile(path.join(__dirname, '../../pages/signup.html'));
})

pageController.get(['/', '/chat', '/users', '/notification', '/settings', '/profile'], isAuthenticated, isAuthorized('admin'), (req: Request, res: Response): any => {
    return res.status(200).sendFile(path.join(__dirname, '../../public/browser/index.html'));
});
