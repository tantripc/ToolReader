using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Options;
using System;
using System.Linq;

namespace WebAdmin.Helper
{
    public static class WebCultures
    {
        public static bool HasCulture(this HttpContext httpContext)
        {
            return httpContext.HasCookie(CookieRequestCultureProvider.DefaultCookieName);
        }

        public static string GetCurrentCulture(this HttpContext httpContext)
        {
            return httpContext.Features.Get<IRequestCultureFeature>().RequestCulture.Culture.Name;
        }

        public static void SetCurrentCulture(this HttpContext httpContext, string culture)
        {
            if (string.IsNullOrWhiteSpace(culture))
            {

                return;
            }

            var locOptions = (IOptions<RequestLocalizationOptions>)httpContext.RequestServices.GetService(typeof(IOptions<RequestLocalizationOptions>));
            var cultureItems = locOptions.Value.SupportedUICultures
                .Select(c => new SelectListItem { Value = c.Name, Text = c.DisplayName })
                .Where(w => w.Value == culture)
                .ToList();

            if (cultureItems.Count > 0)
            {
                httpContext.SetCookie(
                    CookieRequestCultureProvider.DefaultCookieName,
                    CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
                    new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1), IsEssential = true }
                );
            }
        }


    }
}
