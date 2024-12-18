using System.Text.Json.Serialization;

public class GetConversationDTO {

    [JsonPropertyName("chatmate")]
    public required string Chatmate { get; set; }
}