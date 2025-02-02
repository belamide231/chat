export interface insertMessageDto {
    contentType: string;
    content: string;
    receiverId: number;
}

const value = {
    "contentType": "string",    // file | text 
    "content": "string",        // HELLO WORLD!
    "receiverId": 41            // 3
}