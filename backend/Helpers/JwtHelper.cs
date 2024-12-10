using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson.Serialization.IdGenerators;

namespace backend.Helpers;

public class JwtHelper {

    
    private static readonly string _Key = "1234567890qwertyuiopasdfghjklzxcvbnm";
    private static readonly JwtSecurityTokenHandler _TokenHandler = new JwtSecurityTokenHandler();
    public static readonly TokenValidationParameters _TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_Key)),
        ClockSkew = TimeSpan.Zero
    };

    public static string CreateToken(string UserId, string Role) {
        return _TokenHandler.WriteToken(
            _TokenHandler.CreateToken(
                new SecurityTokenDescriptor {
                    Subject = new ClaimsIdentity(new [] {
                        new Claim(ClaimTypes.NameIdentifier, UserId),
                        new Claim(ClaimTypes.Role, Role)
                    }),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_Key)),
                        SecurityAlgorithms.HmacSha256Signature
                    )
                }
            )
        );
    }

    public static async Task<ClaimsPrincipal> ValidateTokenAsync(string Token) {
        
        try {

            var Principal = await Task.Run(() => {
                var ClaimsPrincipal = _TokenHandler.ValidateToken(Token, _TokenValidationParameters, out var validatedToken);
                return ClaimsPrincipal;
            });

            return Principal;
        
        } catch {

            return null!;
        }
    }

}