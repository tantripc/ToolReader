using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApi.App_Code;
using WebApi.Models;

namespace WebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class authController : ControllerBase
    {
        private readonly IConfiguration _config;

        public authController(IConfiguration config)
        {
            _config = config;
        }

        // POST: api/auth/token
        //[Authorize]
        //[Consumes("application/x-www-form-urlencoded")]
        [HttpPost]
        public IActionResult token()
        {
            try
            {
                string client_id = "";
                string client_secret = "";
                if (this.Request.Headers.ContainsKey("Authorization"))
                {
                    var keyword = this.Request.Headers["Authorization"].ToString();
                    if (keyword != null)
                    {
                        var str = Base64Decode(keyword.Split(new char[] { ' ' }).Last()).Split(new char[] { ':' });
                        client_id = str[0];
                        client_secret = str[1];
                    }
                }
                else
                {
                    StreamReader reader = new StreamReader(this.Request.Body);
                    string text = reader.ReadToEnd();

                    tokenrequest reqst = JsonConvert.DeserializeObject<tokenrequest>(text);
                    client_id = reqst.client_id;
                    client_secret = reqst.client_secret;
                }

                IActionResult response = Unauthorized();
                if (this.VerifyClient(client_id, client_secret))
                {
                    int expiresIn = 0;
                    var tokenString = this.GenerateJSONWebToken(client_id, client_secret, ref expiresIn);
                    //response = Ok(new { token = tokenString });
                    response = Ok(new
                    {
                        access_token = tokenString,
                        expires_in = expiresIn.ToString(),
                        expires_at = DateTime.UtcNow.AddMinutes(expiresIn).ToString()
                    });
                }
                return response;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private bool VerifyClient(string client_id, string client_secret)
        {
            try
            {
                if (string.IsNullOrEmpty(client_id)
                    || string.IsNullOrEmpty(client_secret))
                    return false;
                //return (client_secret == _config["Authentication:Clients:" + client_id]);
                return (WebConfigs.Authentication.Clients.Where(x => x.Id == client_id && x.Secret == client_secret).FirstOrDefault() != null);
            }
            catch (Exception ex)
            {
                //(new Log(_config)).Write("AuthController.VerifyClient() exception. Msg: '" + ex.Message + "'");
                Log.Write("AuthController.VerifyClient() exception. Msg: '" + ex.Message + "'");
                return false;
            }
        }

        private string GenerateJSONWebToken(string client_id, string client_secret, ref int expiresIn)
        {
            try
            {
                // token timeout
                int timeoutInMinute = 120;
                if (!int.TryParse(_config["Authentication:Jwt:TimeoutInMinute"], out timeoutInMinute))
                    timeoutInMinute = 120; //default
                expiresIn = timeoutInMinute;

                var claims = new List<Claim>
                {
                    //new Claim(JwtRegisteredClaimNames.Sub, email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.NameIdentifier, client_id), //user.Id
                    new Claim(JwtRegisteredClaimNames.Nbf, new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds().ToString()),
                    new Claim(JwtRegisteredClaimNames.Exp, new DateTimeOffset(DateTime.Now.AddMinutes(timeoutInMinute)).ToUnixTimeSeconds().ToString())
                };

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Authentication:Jwt:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(_config["Authentication:Jwt:Issuer"],
                  _config["Authentication:Jwt:Issuer"],
                  claims, //null
                  expires: DateTime.Now.AddMinutes(timeoutInMinute), //120
                  signingCredentials: credentials);
                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                //(new Log(_config)).Write("AuthController.VerifyClient() exception. Msg: '" + ex.Message + "'");
                Log.Write("AuthController.VerifyClient() exception. Msg: '" + ex.Message + "'");
                return null;
            }
        }

        private string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }
    }
}
