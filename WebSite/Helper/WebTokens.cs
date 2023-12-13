using Newtonsoft.Json;
using WebAdmin.Models;
namespace WebAdmin.Helper
{
    public static class WebTokens
    {
        public static string GetToken(this HttpContext httpContext)
        {
            return httpContext.GetCookie("token");

            //AuthenticateResult auth = httpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme).Result;
            //if (auth.Succeeded)
            //{
            //    return (from claim in auth.Principal.Claims
            //            where claim.Type == "TokenKey"
            //            select claim.Value).FirstOrDefault();
            //}
            //return null;
        }

        public static void SetToken(this HttpContext httpContext, long UserID, string DeviceKey = null, string Language = null, string UserAgent = null, string Vendor = null, string Site = null)
        {
            //lấy token đăng nhập
            string sessionRes = new RepositoriesAPI.RepUserToken(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret)
                    .Add(UserID, DeviceKey, Language, UserAgent, Vendor, Site);


            if (!string.IsNullOrEmpty(sessionRes))
            {
                ReturnSession sessionResObject = JsonConvert.DeserializeObject<ReturnSession>(sessionRes);
                if (!string.IsNullOrEmpty(sessionResObject.tokenkey))
                {
                    httpContext.SaveToken(sessionResObject.tokenkey);
                    //httpContext.SetCookie("token", sessionResObject.tokenkey, DateTimeOffset.UtcNow.AddDays(30));

                    //var claims = new List<Claim>
                    //            {
                    //                new Claim(ClaimTypes.Name, UserID.AsString()),
                    //                new Claim("TokenKey", sessionResObject.tokenkey)
                    //            };

                    //var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    //var authProperties = new AuthenticationProperties
                    //{
                    //    //AllowRefresh = <bool>,
                    //    // Refreshing the authentication session should be allowed.

                    //    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(365),
                    //    // The time at which the authentication ticket expires. A 
                    //    // value set here overrides the ExpireTimeSpan option of 
                    //    // CookieAuthenticationOptions set with AddCookie.

                    //    IsPersistent = true,
                    //    // Whether the authentication session is persisted across 
                    //    // multiple requests. Required when setting the 
                    //    // ExpireTimeSpan option of CookieAuthenticationOptions 
                    //    // set with AddCookie. Also required when setting 
                    //    // ExpiresUtc.

                    //    IssuedUtc = DateTimeOffset.UtcNow,
                    //    // The time at which the authentication ticket was issued.

                    //    //RedirectUri = <string>
                    //    // The full path or absolute URI to be used as an http 
                    //    // redirect response value.
                    //};

                    //await httpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);
                }
            }
        }

        public static void SaveToken(this HttpContext httpContext, string TokenKey)
        {
            httpContext.SetCookie("token", TokenKey, DateTimeOffset.UtcNow.AddDays(30));
        }

        public static void RemoveToken(this HttpContext httpContext)
        {
            httpContext.RemoveCookie("token");
            //await httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }
    }
}
