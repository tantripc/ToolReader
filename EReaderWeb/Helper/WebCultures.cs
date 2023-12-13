using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Options;
using System.Globalization;
using System.Net;
using System.Text.RegularExpressions;

namespace EReaderWeb.Helper
{
    public static class WebCultures
    {
      
        public static async Task<bool> DoesUrlExists(String url)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    //Do only Head request to avoid download full file
                    var response = await client.SendAsync(new HttpRequestMessage(HttpMethod.Head, url));

                    if (response.IsSuccessStatusCode)
                    {
                        //Url is available is we have a SuccessStatusCode
                        return true;
                    }
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }
        public static string GetCurrentCulture(this HttpContext httpContext)
        {
            return httpContext.Features.Get<IRequestCultureFeature>().RequestCulture.Culture.Name;
        }

    }
    public class RouteCultureProvider : IRequestCultureProvider
{
    private CultureInfo defaultCulture;
    private CultureInfo defaultUICulture;

    public RouteCultureProvider(RequestCulture requestCulture)
    {
        this.defaultCulture = requestCulture.Culture;
        this.defaultUICulture = requestCulture.UICulture;
    }

    public Task<ProviderCultureResult> DetermineProviderCultureResult(HttpContext httpContext)
    {
        //Parsing language from url path, which looks like "/en/home/index"
        PathString url = httpContext.Request.Path;

        // Test any culture in route
        if (url.ToString().Length <= 1)
        {
            // Set default Culture and default UICulture
            return Task.FromResult<ProviderCultureResult>(new ProviderCultureResult(this.defaultCulture.TwoLetterISOLanguageName, this.defaultUICulture.TwoLetterISOLanguageName));
        }

        var parts = httpContext.Request.Path.Value.Split('/');
        var culture = parts[1];

        // Test if the culture is properly formatted
        if (!Regex.IsMatch(culture, @"^[a-z]{2}(-[A-Z]{2})*$"))
        {
            // Set default Culture and default UICulture
            return Task.FromResult<ProviderCultureResult>(new ProviderCultureResult(this.defaultCulture.TwoLetterISOLanguageName, this.defaultUICulture.TwoLetterISOLanguageName));
        }

        // Set Culture and UICulture from route culture parameter
        return Task.FromResult<ProviderCultureResult>(new ProviderCultureResult(culture, culture));
    }
}
}
