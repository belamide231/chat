using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class MessageSchema {

    [BsonElement("_id")]
    public string Id { get; set; }

    [BsonElement("TimeStamp")]
    public DateTime TimeStamp { get; set; }

    [BsonElement("SenderId")]
    public string SenderId { get; set; }

    [BsonElement("Message")]
    public string Message { get; set; } = string.Empty;

    [BsonElement("Files")]
    public string? Files { get; set; } // FILE PATH

    public MessageSchema(DateTime __TimeStamp, string __SenderId, string __Message) {
        Id = ObjectId.GenerateNewId().ToString();
        TimeStamp = __TimeStamp;
        SenderId = __SenderId;
        Message = __Message;
        Files = string.Empty;
    }
}