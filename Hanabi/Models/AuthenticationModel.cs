using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Hanabi.Models {
    public class AuthenticationModel {

        [JsonProperty]
        [RegularExpression(@"^[a-zA-Z0-9]+$", MatchTimeoutInMilliseconds = 500)]
        public string Nickname { get; set; }

    }
}