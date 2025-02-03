import { mysql, socketClients, io, redis } from "../app";
import { getConversationDto } from "../dto/messageController/getConversationDto";
import { getMessageDto } from "../dto/messageController/getMessageDto";
import { insertMessageDto } from "../dto/messageController/insertMessageDto";
import { loadChatListDto } from "../dto/messageController/loadChatListDto";
import { seenChatDto } from "../dto/messageController/seenChatDto";
import { validContentType } from "../validations/validContentType";
import { validRoles } from "../validations/validRoles";


export const insertMessageService = async (data: insertMessageDto, senderId: number): Promise<number> => {
    if(isNaN(data.receiverId) || !validContentType.includes(data.contentType!) || !data.content)
        return 400;

    try {

        const result = (await mysql.promise().query('CALL insert_message(?, ?, ?, ?, ?)', [null, data.contentType, data.content, senderId, data.receiverId]) as any)[0][0][0];

        let socketIds: string[] = [];
        socketIds = socketIds.concat(socketClients.clientConnections[senderId]);
        socketIds = socketIds.concat(socketClients.clientConnections[data.receiverId!]);

        socketIds.forEach((v) => io.to(v).emit('newmessage', JSON.stringify({ receiverId: result.receiver_id, messageId: result.message_id })));

        return 200;

    } catch {
        console.log("MYSQL ERROR");
        return 500;
    }
}

export const getActiveClientsService = async (role: string): Promise<{ status: number, result: object | null }> => {
    if(!validRoles.includes(role))
        return { status: 400, result: null };

    let actives: any = [];
    switch(role) {
        case 'admin':
            actives = actives.concat(socketClients.adminsId);
            actives = actives.concat(socketClients.accountsId);
            break;
        case 'account':
            actives = actives.concat(socketClients.adminsId);
            actives = actives.concat(socketClients.superUsersId);
            break;
        case 'superUser':
            actives = actives.concat(socketClients.accountsId);
            break;        
        default:
            break;
    }

    if(actives.length === 0) 
        return { status: 200, result: [] };

    const result = await redis.con.mGet([...actives.map((v: any) => 'db4:' + v.toString())]);
    const sids = result.map((v: any) => {
        if(v !== null) 
            return v.toString();
    }) as string[];
    
    if(sids.length === 0)
        return { status: 200, result: [] };

    const data = await redis.con.mGet([...sids]);
    const json = data.map(v => {
        if(v !== null)
            return JSON.parse(v);
    });

    if(json.length === 0)
        return { status: 200, result: [] };

    return { status: 200, result: json };
}

export const loadChatListServices = async (id: number, data: loadChatListDto): Promise<{ status: number, result: object | null }> => {
    if(isNaN(data.chatListLength))
        return { status: 400, result: null };

    try {

        const result = (await mysql.promise().query('CALL get_chat_list(?, ?)', [data.chatListLength, id]) as any)[0];
        result.pop();
        return { status: 200, result: result };

    } catch(error) {

        console.log("MYSQL ERROR");
        return { status: 500, result: null };
    }
}

export const loadMessageService = async (data: getMessageDto, userId: number): Promise<{ status: number, result: object | null }> => {
    if(isNaN(data.messageId))
        return { status: 400, result: null };

    try {

        const result = (await mysql.promise().query('CALL get_message(?, ?);', [data.messageId, userId]) as any)[0][0][0];
        return { status: 200, result: result }

    } catch {

        console.log("MYSQL ERROR");
        return { status: 500, result: null }
    }
}

export const loadMessagesService = async (userId: number, data: getConversationDto): Promise<{ status: number, result: object | null }> => {
    if(isNaN(data.chatmateId) || isNaN(data.messageLength))
        return { status: 400, result: null };

    try {

        const result = (await mysql.promise().query('CALL load_messages(?, ?, ?, ?)', [data.messageLength, userId, data.chatmateId, 15]) as any)[0][0];
        return { status: 200, result: result };

    } catch {

        console.log("MYSQL ERROR");
        return { status: 500, result: null };
    }
}

export const seenChatService = async (userId: number, data: seenChatDto): Promise<number> => {
    if(isNaN(data.chatmateId))
        return 400;

    try {

        await mysql.promise().query('CALL seen_chat(?, ?)', [userId, data.chatmateId]);
        return 200;

    } catch {

        console.log("MYSQL ERROR");
        return 500;
    }
}
