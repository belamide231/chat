using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;



public class ConversationSchema {

    [BsonElement("_id")]
    public string Id { get; set; }

    [BsonElement("ListOfChatmateId")]
    public List<string> ListOfChatmateId { get; set; }

    [BsonElement("LatestMessageSeen")]
    public List<LatestMessageSeenSchema>? LatestMessageSeen { get; set; }

    [BsonElement("ListOfMessages")] 
    public List<MessageSchema>? ListOfMessages { get; set; }

    public ConversationSchema(List<string> __ListOfChatmateId) {
        Id = ObjectId.GenerateNewId().ToString();
        ListOfChatmateId = __ListOfChatmateId;
        LatestMessageSeen = new List<LatestMessageSeenSchema>();
        ListOfMessages = new List<MessageSchema>();
    }
}