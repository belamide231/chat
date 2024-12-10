using System.Text.Json.Serialization;

public class GetConversationDTO {

    [JsonPropertyName("ChatmateId")]
    public required string ChatmateId { get; set; }
}