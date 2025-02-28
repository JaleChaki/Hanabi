using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Hanabi.Models;
public class AuthenticationModel {
    [JsonProperty, Key, Required]
    public string UserId { get; set; }
    [JsonProperty]
    [RegularExpression(@"^[a-zA-Z0-9]+$", MatchTimeoutInMilliseconds = 500)]
    public string NickName { get; set; }
    [JsonProperty, MinLength(9), Required]
    public string Password { get; set; }

}