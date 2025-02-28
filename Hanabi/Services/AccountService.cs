using System.IdentityModel.Tokens.Jwt;
using System.Security.Authentication;
using System.Security.Claims;
using System.Text;
using Hanabi.Models;
using Microsoft.IdentityModel.Tokens;

namespace Hanabi.Services;
public class AccountService {

    public AccountService(IConfiguration configuration) {
        Issuer = configuration["Issuer"];
        Audience = configuration["Audience"];
        // TODO move key to protected place
        SigningKey = configuration["SignKey"];
    }

    private string Issuer { get; }

    private string Audience { get; }

    private string SigningKey { get; }

    public TokenModel Authenticate(AuthenticationModel model) {
        // TODO move password to environment variables
        if(model.Password != "qwerty654")
            throw new AuthenticationException();

        var identity = CreateClaimsIdentity(model.UserId);
        var jwt = new JwtSecurityToken(
            issuer: Issuer,
            audience: Audience,
            claims: identity.Claims,
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SigningKey)), SecurityAlgorithms.HmacSha256)
        );

        var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
        return new TokenModel {
            AccessToken = encodedJwt,
            ExpiredAt = DateTime.MaxValue
        };
    }

    private static ClaimsIdentity CreateClaimsIdentity(string userId) {
        var claims = new List<Claim>() {
            new(ClaimsIdentity.DefaultNameClaimType, userId),
            new (ClaimsIdentity.DefaultRoleClaimType, "user")
        };
        return new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
    }

}