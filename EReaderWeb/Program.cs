using EReaderWeb.Helper;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);
ConfigurationManager configuration = builder.Configuration;
IWebHostEnvironment environment = builder.Environment;
// Add services to the container.
builder.Services.AddRazorPages();
var settings = builder.Configuration.GetSection("AppSettings").Get<AppSettings>();
//set static WebConfigs
WebConfigs.WebRootPath = environment.WebRootPath;
WebConfigs.ContentRootPath = environment.ContentRootPath;
WebConfigs.AppSettings = settings;

builder.Services.AddSession(options =>
  {
      options.Cookie.Name = ".ereader.Session";
      // Set a short timeout for easy testing.
      options.IdleTimeout = System.TimeSpan.FromHours(24);
      // Make the session cookie essential
      options.Cookie.IsEssential = true;
  });
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.Cookie.Name = ".ereader.Cookies";
                    options.Cookie.IsEssential = true;
                });
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
builder.Services.Configure<FormOptions>(options =>

            {

                options.ValueLengthLimit = int.MaxValue;

                options.MultipartBodyLengthLimit = int.MaxValue;

                options.MultipartHeadersLengthLimit = int.MaxValue;

            });

builder.Services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
//services.AddHostedService<Helper.NotifyHostedService>();
builder.Services
    .AddControllersWithViews()
    .AddNewtonsoftJson()
    .AddJsonOptions(option =>
    {
        option.JsonSerializerOptions.PropertyNamingPolicy = null;
    })

    .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
    .AddDataAnnotationsLocalization();

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    CultureInfo[] supportedCultures = new[]
    {
                        new CultureInfo("vi"),
                        new CultureInfo("en")
        };

    options.DefaultRequestCulture = new RequestCulture("vi");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
    options.RequestCultureProviders = new List<IRequestCultureProvider>
                           {
                        new QueryStringRequestCultureProvider(),
                        new CookieRequestCultureProvider()
                           };
    //options.RequestCultureProviders.Insert(0, new RouteCultureProvider(options.DefaultRequestCulture));
});
var app = builder.Build();
app.UseCors(builder =>
                builder
                    //.WithOrigins(appSettings.Value.AllowOrigins != null ? appSettings.Value.AllowOrigins.Split(',') : new string[] { "*" })
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    //.AllowCredentials()
                    .SetIsOriginAllowedToAllowWildcardSubdomains()
            );

app.UseRequestLocalization();


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}

//app.UseHttpsRedirection();
app.UseStaticFiles();


app.UseRouting();

app.UseAuthorization();
app.UseSession();
app.UseStatusCodePagesWithReExecute("/error/{0}");

app.UseEndpoints(endpoints =>
            {
                //endpoints.MapControllerRoute(
                //    name: "Admin",
                //    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");
                //endpoints.MapControllerRoute(
                //   name: "Learner",
                //   pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");
                //endpoints.MapControllerRoute(
                //  name: "Instructor",
                //  pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");
                //endpoints.MapControllerRoute(
                //  name: "Saler",
                //  pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}");
            });
//app.MapGet("Account/Profile", () => "Profile");
app.MapRazorPages();
app.Run();
