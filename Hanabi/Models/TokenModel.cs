using Newtonsoft.Json;

namespace Hanabi.Models;
public class TokenModel {

    [JsonProperty("token_type")]
    public string TokenType => "Bearer";

    [JsonProperty("access_token")]
    public string AccessToken { get; set; }

    [JsonProperty("expired_at")]
    public DateTime ExpiredAt { get; set; }

}