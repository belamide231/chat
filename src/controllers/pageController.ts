import { Router, Request, Response } from "express";
import path from 'path';

import { isAuthenticated } from "../guards/isAuthenticated";
import { hasToken } from "../guards/hasToken";

export const pageController = Router();

pageController.get('/login', hasToken, (req: Request, res: Response): void => {
    if(req.cookies['unauthorized']) {
        res.clearCookie('unauthorized');
        res.status(401).sendFile(path.join(__dirname, '../testPages/login.html'))
    }
        
    return res.sendFile(path.join(__dirname, '../testPages/login.html'));
});

pageController.get('/chat', isAuthenticated, (req: Request, res: Response): any => {
    return res.status(200).sendFile(path.join(__dirname, '../testPages/chat.html'));
});

pageController.get(['/', 'users', 'notification', 'settings', 'profile'], isAuthenticated, (req: Request, res: Response): any => {
    return res.status(200).sendFile(path.join(__dirname, '../../public/browser/index.html'));
});