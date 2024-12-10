using backend.WebSockets;
using Database;
using MongoDB.Driver;
using Pipelines.Sockets.Unofficial.Arenas;


namespace backend.Services;


public class MessageServices : WebSocketClients {

    private readonly Mongo _Mongo;
    private readonly Redis _Redis;

    public MessageServices(Mongo __Mongo, Redis __Redis) {
        _Mongo = __Mongo;
        _Redis = __Redis;
    }

    public async Task<object> SendMessage(SendMessageDTO Data, string Role) {

        Data.ListOfReceiverId!.Add(Data.SenderId!);

        var Conversations = await _Mongo.ConversationCollection().Find(
            Builders<ConversationSchema>.Filter.And(
                Builders<ConversationSchema>.Filter.All(x => x.ListOfChatmateId, Data.ListOfReceiverId),
                Builders<ConversationSchema>.Filter.Eq(x => x.ListOfChatmateId, Data.ListOfReceiverId)
            )
        ).ToListAsync();
        var ConversationId = "";

        if(Conversations.Count == 0) {
            
            var NewConversation = new ConversationSchema(Data.ListOfReceiverId!);
            ConversationId = NewConversation.Id;

            try {

                await _Mongo.ConversationCollection().InsertOneAsync(NewConversation);

            } catch {

                return new {

                    Status = StatusCodes.Status500InternalServerError,
                    Data = (object)null!
                };
            }

        } else {

            ConversationId = Conversations.FirstOrDefault()!.Id;
        }

        var Message = new MessageSchema(DateTime.UtcNow, Data.SenderId!, Data.Message!);

        try {

            var Result = await _Mongo.ConversationCollection().FindOneAndUpdateAsync(
                Builders<ConversationSchema>.Filter.Eq(x => x.Id, ConversationId),
                Builders<ConversationSchema>.Update.Push(x => x.ListOfMessages, Message)
            );

            _ = SendMessageWebSocket(Role, ConversationId, Message);

            return new {
                Status = StatusCodes.Status200OK,
                Data = (object)null! // TEMPORARY
            };
       
        } catch {

            return new {
                Status = StatusCodes.Status500InternalServerError,
                Data = (object)null!
            };
        }
    }

    public async Task<object> GetConversation(GetConversationDTO Data, string UserId) {

        var ListOfChatmatesId = new List<string>(new [] { Data.ChatmateId, UserId });

        try {

            var Result = await _Mongo.ConversationCollection().Find(
                Builders<ConversationSchema>.Filter.And(
                    Builders<ConversationSchema>.Filter.All(x => x.ListOfChatmateId, ListOfChatmatesId),
                    Builders<ConversationSchema>.Filter.Eq(x => x.ListOfChatmateId.Count, ListOfChatmatesId.Count)
                )
            ).Project<ConversationSchema>(
                Builders<ConversationSchema>.Projection
                    .Include(x => x.Id)
                    .Include(x => x.LatestMessageSeen)
                    .Slice(x => x.ListOfMessages, -30)
            ).ToListAsync();

            return new {
                Status = StatusCodes.Status200OK,
                Data = Result!  
            };
            
        } catch {

            return new {
                Status = StatusCodes.Status204NoContent,
                Data = (object)null!  
            };
        }
    }
}
