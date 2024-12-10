using MongoDB.Bson.Serialization.Attributes;


[BsonIgnoreExtraElements]
public class LatestMessageSeenSchema {

    [BsonElement("TimeStamp")]
    public required string TimeStamp { get; set; }
    
    [BsonElement("UserId")]
    public required string UserId { get; set; }

    [BsonElement("MessageId")]
    public required string MessageId { get; set; }
}