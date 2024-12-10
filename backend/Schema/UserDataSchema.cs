using MongoDB.Bson.Serialization.Attributes;

public class UserDataSchema {

    [BsonElement("_id")]
    public required string Id { get; set; }

    [BsonElement("Role")]
    public required string Role { get; set; }

    [BsonElement("ListOfConversationId")]
    public List<string>? ListOfConversationId { get; set; }

    public UserDataSchema(string __Id, string __Role) {
        Id = __Id;
        Role = __Role;
        ListOfConversationId = new List<string>();
    }
}