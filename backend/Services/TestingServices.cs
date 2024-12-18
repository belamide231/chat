using MySql.Data.MySqlClient;
using Database;
using ZstdSharp.Unsafe;
using System.Diagnostics;

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

    public ConversationHeadsModel(int __ChatmateId, int __Id, DateTime __SentAt, bool __ContentText, bool __ContentFile, string __Content, int __SenderId, int __ReceiverId, bool __ContentSeen) {
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

public class TestingServices {

    private readonly Mysql _Mysql;

    public TestingServices(Mysql __Mysql) {
        _Mysql = __Mysql;
    }

    public async Task<object> SendMessage(string NameIdentifier) {
        
        try {

            var Connection = _Mysql.GetConnection();
            var Command = new MySqlCommand($"CALL get_conversations_heads('{NameIdentifier}')", Connection);
            var Reader = await Command.ExecuteReaderAsync();
            var ConversationsHeadsList = new List<ConversationHeadsModel>();

            while (await Reader.ReadAsync()) 
                ConversationsHeadsList.Add(new ConversationHeadsModel(Reader.GetInt32(0), Reader.GetInt32(1), Reader.GetDateTime(2), Reader.GetBoolean(3), Reader.GetBoolean(4), Reader.GetString(5), Reader.GetInt32(6), Reader.GetInt32(7), Reader.GetBoolean(8)));

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

}

