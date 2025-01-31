import { Request, Response, NextFunction } from "express";

import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utilities/jwt";
import { cookieOptions, redis } from "../app";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {

    const user: any = {};
    const atk = verifyAccessToken(req.cookies['atk']);
    if(!atk.token) {

        const rtk = verifyRefreshToken(req.cookies['rtk']);
        if(!rtk.token) {

            res.clearCookie('atk');
            res.clearCookie('rtk');
            res.cookie('unauthorized', true);
            return res.redirect('/login');
        }
    
        const sid = req.sessionID;
        const payload = rtk.payload as any;
        const refreshToken = generateRefreshToken(payload.sub, payload.name, payload.role, payload.picture);
        const accessToken = generateAccessToken(sid, payload.sub, payload.name, payload.role, payload.picture);
        payload.id = payload.sub;
    
        res.cookie('rtk', refreshToken, cookieOptions);
        res.cookie('atk', accessToken, cookieOptions);
    
        user['id'] = payload.sub;
        user['name'] = payload.name;
        user['role'] = payload.role;
        user['picture'] = payload.picture;

        delete payload.sub;
        delete payload.iat;
        delete payload.exp;
        delete payload.iss;
        delete payload.aud;
        
        try {
    
            await redis.db1.set(sid, JSON.stringify(payload), { EX: 60 * 60 });
    
        } catch {

            return res.status(500).redirect('/login');
        } 
    
    } else {

        const payload = atk.payload as any;
        user['id'] = payload.sub;
        user['name'] = payload.name;
        user['role'] = payload.role;
        user['picture'] = payload.picture;
    }

    req.user = user;
    next();
}