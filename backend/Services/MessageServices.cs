using Database;
using MySql.Data.MySqlClient;


public class MessageServices : WebSocketClients {
    private readonly Mysql _Mysql;
    private readonly Redis _Redis;
    public MessageServices(Mysql __Mysql, Redis __Redis) {
        _Mysql = __Mysql;
        _Redis = __Redis;
    }

    public class ConversationHeadsModel {
        public int ChatmateId { get; set; }
        public int Id { get; set; }
        public DateTime SentAt { get; set; }
        public bool ContentText { get; set; }
        public bool ContentFile { get; set; }
        public string Content { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public bool ContentSeen { get; set; }

        public ConversationHeadsModel(
            int __ChatmateId, 
            int __Id, 
            DateTime __SentAt, 
            bool __ContentText, 
            bool __ContentFile, 
            string __Content, 
            int __SenderId, 
            int __ReceiverId, 
            bool __ContentSeen
        ) {
            ChatmateId = __ChatmateId;
            Id = __Id;
            SentAt = __SentAt;
            ContentText = __ContentText;
            ContentFile = __ContentFile;
            Content = __Content;
            SenderId = __SenderId;
            ReceiverId = __ReceiverId;
            ContentSeen = __ContentSeen;
        }
    }
    public async Task<object> GetConversationsHeadsService(string NameIdentifier) {
        
        try {

            var Connection = _Mysql.GetConnection();
            var Command = new MySqlCommand($"CALL get_conversations_heads('{NameIdentifier}')", Connection);
            var Reader = await Command.ExecuteReaderAsync();
            var ConversationsHeadsList = new List<ConversationHeadsModel>();

            while (await Reader.ReadAsync()) 
                ConversationsHeadsList.Add(new ConversationHeadsModel(
                    Reader.GetInt32(0), 
                    Reader.GetInt32(1), 
                    Reader.GetDateTime(2), 
                    Reader.GetBoolean(3), 
                    Reader.GetBoolean(4), 
                    Reader.GetString(5), 
                    Reader.GetInt32(6), 
                    Reader.GetInt32(7), 
                    Reader.GetBoolean(8)
                ));

            return new {
                Status = StatusCodes.Status200OK,
                Data = ConversationsHeadsList
            };
        
        } catch (Exception ex) {

            return new {
                Status = StatusCodes.Status500InternalServerError,
                Data = ex.Message
            };
        }
    }


    public class MessageModel {
        public int ChatmateId { get; set; }
        public int Id { get; set; }
        public DateTime SentAt { get; set; }
        public bool ContentText { get; set; }
        public bool ContentFile { get; set; }
        public string? Content { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public bool ContentSeen { get; set; }
        public MessageModel (
            int __ChatmateId, 
            int __Id, 
            DateTime __SentAt, 
            bool __ContentText, 
            bool __ContentFile, 
            string __Content,
            int __SenderId,
            int __ReceiverId,
            bool __ContentSeen
        ) {
            ChatmateId = __ChatmateId;
            Id = __Id;
            SentAt = __SentAt;
            ContentText = __ContentText;
            ContentFile = __ContentFile;
            Content = __Content;
            SenderId = __SenderId;
            ReceiverId = __ReceiverId;
            ContentSeen = __ContentSeen;
        }
    }
    public async Task<object> GetConversationService(string NameIdentifier, GetConversationDTO Data) {

        try {

            var Connection = _Mysql.GetConnection();
            var Command = new MySqlCommand($"CALL get_conversation('{NameIdentifier}', '{Data.Chatmate}')", Connection);
            var Reader = await Command.ExecuteReaderAsync();
            var ConversationMessagesList = new List<MessageModel>();
            
            while (await Reader.ReadAsync())
                ConversationMessagesList.Add(new MessageModel(
                    Reader.GetInt32(0), 
                    Reader.GetInt32(1), 
                    Reader.GetDateTime(2),
                    Reader.GetBoolean(3),
                    Reader.GetBoolean(4),
                    Reader.GetString(5),
                    Reader.GetInt32(6),
                    Reader.GetInt32(7),
                    Reader.GetBoolean(8)
                ));

            return new {
                Status = StatusCodes.Status200OK,
                Data = ConversationMessagesList
            };

        } catch (Exception ex) {

            return new {
                Status = StatusCodes.Status500InternalServerError,
                Data = ex.Message
            };
        }
    }


}