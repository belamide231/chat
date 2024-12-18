using System.Text.Json.Serialization;

public class SendMessageDTO {
    
    [JsonPropertyName("SenderId")]
    public string? SenderId { get; set; } = string.Empty;

    [JsonPropertyName("ReceiverId")]
    public string? ReceiverId { get; set; } = string.Empty;

    [JsonPropertyName("Content")]
    public string? Content { get; set; } = string.Empty;
}