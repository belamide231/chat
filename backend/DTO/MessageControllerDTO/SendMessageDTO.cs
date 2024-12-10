using System.Text.Json.Serialization;

public class SendMessageDTO {
    
    [JsonPropertyName("TimeStamp")]
    public required string? TimeStamp { get; set; }

    [JsonPropertyName("SenderId")]
    public required string? SenderId { get; set; }

    [JsonPropertyName("ListOfReceiverId")]
    public List<string>? ListOfReceiverId { get; set; } = new List<string>();

    [JsonPropertyName("Message")]
    public required string? Message { get; set; }
}