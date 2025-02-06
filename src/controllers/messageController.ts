import { Router, Request, Response } from "express";

import { getActiveClientsService, insertMessageService, loadChatListServices, loadMessageService, loadMessagesService, seenChatService } from "../services/messageServices";
import { insertMessageDto } from "../dto/messageController/insertMessageDto";
import { getConversationDto } from "../dto/messageController/getConversationDto";
import { isAuthenticated } from "../guards/isAuthenticated";
import { getMessageDto } from "../dto/messageController/getMessageDto";
import { seenChatDto } from "../dto/messageController/seenChatDto";
import { loadChatListDto } from "../dto/messageController/loadChatListDto";
import { upload } from "../utilities/multer";
import { dropboxUpload } from "../utilities/dropbox";

export const messageController = Router();
messageController


.post('/insertMessage', isAuthenticated, upload.single('file'), dropboxUpload, async (req: Request, res: Response): Promise<any> => {
    return res.sendStatus(await insertMessageService(req.body as insertMessageDto, (req.user as any).id));
})


.post('/getActiveClients', isAuthenticated, async (req: Request, res: Response): Promise<any> => {
    const response = await getActiveClientsService((req.user as any).role);

    if(response.status !== 200) 
        return res.sendStatus(response.status); 

    return res.status(200).json(response.result);
})


.post('/loadChatList', isAuthenticated, async (req: Request, res: Response): Promise<any> => {
    const response = await loadChatListServices((req.user as any).id, req.body as loadChatListDto);
    
    if(response.status !== 200) 
        return res.sendStatus(response.status);

    return res.status(response.status).json(response.result);
})


.post('/loadMessages', isAuthenticated, async (req: Request, res: Response): Promise<any> => {
    const response = await loadMessagesService((req.user as any).id, req.body as getConversationDto);

    if(response.status !== 200) 
        return res.sendStatus(response.status);

    return res.status(200).json(response.result);
})


.post('/loadMessage', isAuthenticated, async (req: Request, res: Response): Promise<any> => {
    const response = await loadMessageService(req.body as getMessageDto, (req.user as any).id);

    if(response.status !== 200) 
        return res.sendStatus(response.status);

    return res.status(response.status).json(response.result);
})


.post('/seenChat', isAuthenticated, async (req: Request, res: Response): Promise<any> => {

    return res.sendStatus(await seenChatService((req.user as any).id, req.body as seenChatDto));
});