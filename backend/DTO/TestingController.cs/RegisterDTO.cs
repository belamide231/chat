using System.Text.Json.Serialization;

public class RegisterDTO {

    [JsonPropertyName("Id")]
    public required string Id { get; set; }

    [JsonPropertyName("Role")]
    public required string Role { get; set; }
}