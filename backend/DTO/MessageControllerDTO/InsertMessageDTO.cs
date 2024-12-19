using System.Text.Json.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

public class InsertMessageDTO {

    public DateTime SentAt = DateTime.UtcNow;
    
    [JsonPropertyName("ContentText")]
    public int ContentText { get; set; }
    
    [JsonPropertyName("ContentFile")]
    public int ContentFile { get; set; }
    
    [JsonPropertyName("Content")]
    public string? Content { get; set; }
    
    [JsonPropertyName("Receiver")]
    public string? Receiver { get; set; }

    public int ContentSeen = 0;
}