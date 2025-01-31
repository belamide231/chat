import { mysql, socketClients, io, redis } from "../app";
import { getConversationDto } from "../dto/messageController/getConversationDto";
import { getMessageDto } from "../dto/messageController/getMessageDto";
import { insertMessageDto } from "../dto/messageController/insertMessageDto";
import { loadConversationDto } from "../dto/messageController/loadConversationDto";
import { seenConversationDto } from "../dto/messageController/seenConversationDto";
import { validContentType } from "../validations/validContentType";
import { validRoles } from "../validations/validRoles";


export const insertMessageService = async (data: insertMessageDto, senderId: number): Promise<number> => {

    if(!data.receiverId || !validContentType.includes(data.contentType!) || !data.content)
        return 401;

    try {

        const result = (await mysql.promise().query('CALL insert_message(?, ?, ?, ?)', [data.contentType, data.content, senderId, data.receiverId]) as any)[0][0][0];

        let socketIds: string[] = [];
        socketIds = socketIds.concat(socketClients.clientConnections[senderId]);
        socketIds = socketIds.concat(socketClients.clientConnections[data.receiverId!]);

        socketIds.forEach(async (v) => await io.to(v).emit('newmessage', JSON.stringify({ receiverId: result.receiver_id, messageId: result.message_id })));

        return 200;

    } catch {

        return 500;
    }
}

export const getActiveClientsService = async (role: string): Promise<{ status: number, result: object | null }> => {
    console.log(role);

    if(!validRoles.includes(role))
        return { status: 401, result: null };

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

    // const result = await redis.db4.mGet([...actives.map(String)]);
    const result = await redis.db1.mGet([...actives.map((v: any) => 'db4:' + v.toString())]);
    const sids = result.map((v: any) => {
        if(v !== null) 
            return v.toString();
    }) as string[];
    
    if(sids.length === 0)
        return { status: 200, result: [] };

    const data = await redis.db1.mGet([...sids]);
    const json = data.map(v => {
        if(v !== null)
            return JSON.parse(v);
    });

    if(json.length === 0)
        return { status: 200, result: [] };

    return { status: 200, result: json };
}

export const getConversationsHeadsService = async (id: number): Promise<{ status: number, result: object | null }> => {

    try {

        const result = (await mysql.promise().query('CALL get_conversations_heads(?)', [id]) as any)[0];
        const custom = result[0].map((v: any) => [v]);
        custom[0] = result[1];
        return { status: 200, result: custom as object };

    } catch(error) {

        return { status: 500, result: null };
    }
}

export const getMessageService = async (data: getMessageDto, userId: number): Promise<{ status: number, result: object | null }> => {
    
    if(!data.messageId)
        return { status: 401, result: null };

    try {

        const result = (await mysql.promise().query('CALL get_message(?, ?);', [data.messageId, userId]) as any)[0][0][0];
        return { status: 200, result: result }

    } catch {

        return { status: 500, result: null }
    }
}

export const getConversationService = async (userId: number, data: getConversationDto): Promise<{ status: number, result: object | null }> => {

    console.log(!data.chatmateId);

    if(!data.chatmateId)
        return { status: 401, result: null };

    try {

        const result = (await mysql.promise().query('CALL get_conversation(?, ?)', [userId, data.chatmateId]) as any)[0][0];
        return { status: 200, result: result };

    } catch {

        return { status: 500, result: null };
    }
}

export const loadConversationService = async (userId: number, data: loadConversationDto): Promise<{ status: number, result: object | null }> => {

    if(!data.chatmateId || !data.messageLength)
        return { status: 401, result: null };

    try {

        const result = (await mysql.promise().query('CALL load_messages(?, ?, ?)', [data.messageLength, userId, data.chatmateId]) as any)[0][0];
        console.log(result);

        return { status: 200, result: result }
    } catch {

        return { status: 500, result: null };
    }
}

export const seenConversationService = async (userId: number, data: seenConversationDto): Promise<number> => {

    if(!data.chatmateId)
        return 401;

    try {

        await mysql.promise().query('CALL seen_conversation(?, ?)', [userId, data.chatmateId]);
        return 200;

    } catch {

        return 500;
    }
}