import { Router, Request, Response } from "express";

import { getActiveClientsService, getConversationService, getConversationsHeadsService, getMessageService, insertMessageService, loadConversationService, seenConversationService } from "../services/messageServices";
import { insertMessageDto } from "../dto/messageController/insertMessageDto";
import { getConversationDto } from "../dto/messageController/getConversationDto";
import { isAuthenticated } from "../guards/isAuthenticated";
import { getMessageDto } from "../dto/messageController/getMessageDto";
import { loadConversationDto } from "../dto/messageController/loadConversationDto";
import { seenConversationDto } from "../dto/messageController/seenConversationDto";

export const messageController = Router();

messageController.post('/insertMessage', isAuthenticated, async (req: Request, res: Response): Promise<any> => {

    return res.sendStatus(await insertMessageService(req.body as insertMessageDto, (req.user as any).id));
});

messageController.post('/getActiveClients', isAuthenticated, async (req: Request, res: Response): Promise<any> => {
    const response = await getActiveClientsService((req.user as any).role);

    if(response.status !== 200) 
        return res.sendStatus(response.status); 

    return res.status(200).json(response.result);
});

messageController.post('/getConversationsHeads', isAuthenticated, async (req: Request, res: Response): Promise<any> => {
    const response = await getConversationsHeadsService((req.user as any).id);
    
    if(response.status !== 200) 
        return res.sendStatus(response.status);

    return res.status(response.status).json(response.result);
});

messageController.post('/getConversation', isAuthenticated, async (req: Request, res: Response): Promise<any> => {
    const response = await getConversationService((req.user as any).id, req.body as getConversationDto);

    if(response.status !== 200) 
        return res.sendStatus(response.status);

    return res.status(200).json(response.result);
});

messageController.post('/getMessage', isAuthenticated, async (req: Request, res: Response): Promise<any> => {
    const response = await getMessageService(req.body as getMessageDto, (req.user as any).id);

    if(response.status !== 200) 
        return res.sendStatus(response.status);

    return res.status(response.status).json(response.result);
});

messageController.post('/loadConversation', isAuthenticated, async (req: Request, res: Response): Promise<any> => {
    const response = await loadConversationService((req.user as any).id, req.body as loadConversationDto);

    if(response.status !== 200) 
        return res.sendStatus(response.status);

    return res.status(200).json(response.result);
});

messageController.post('/seenConversation', isAuthenticated, async (req: Request, res: Response): Promise<any> => {

    return res.sendStatus(await seenConversationService((req.user as any).id, req.body as seenConversationDto));
});