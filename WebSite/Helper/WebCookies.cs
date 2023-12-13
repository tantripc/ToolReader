namespace WebAdmin.Helper
{
    public static class WebCookies
    {

        public static bool HasCookie(this HttpContext httpContext, string key)
        {
            if (string.IsNullOrWhiteSpace(key) || string.IsNullOrWhiteSpace(httpContext.Request.Cookies[key]))
            {
                return false;
            }
            return true;
        }
        public static string GetCookie(this HttpContext httpContext, string key)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                return null;
            }

            if (httpContext.HasCookie(key))
            {
                return httpContext.Request.Cookies[key];
            }
            return null;
        }
        public static void SetCookie(this HttpContext httpContext, string key, string value, DateTimeOffset? expireTime)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                return;
            }

            httpContext.Response.Cookies.Append(
                key,
                value,
                new CookieOptions
                {
                    Expires = expireTime.HasValue ? expireTime : DateTimeOffset.UtcNow.AddDays(30),
                    IsEssential = true
                }
            );
        }
        public static void SetCookie(this HttpContext httpContext, string key, string value, CookieOptions options)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                return;
            }

            httpContext.Response.Cookies.Append(
                key,
                value,
                options
            );
        }

        public static void RemoveCookie(this HttpContext httpContext, string key)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                return;
            }

            httpContext.Response.Cookies.Delete(key);
        }
    }
}
