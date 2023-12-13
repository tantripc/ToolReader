using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Globalization;
using WebAdmin.Helper;

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
      options.IdleTimeout = System.TimeSpan.FromHours(12);
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
builder.Services.AddControllersWithViews().AddNewtonsoftJson()
    .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
    .AddDataAnnotationsLocalization();
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new List<CultureInfo>
                    {
                        new CultureInfo("vi"),
                        new CultureInfo("en"),
                        //new CultureInfo("ja"),
                    };

    options.DefaultRequestCulture = new RequestCulture("vi");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
    options.RequestCultureProviders = new List<IRequestCultureProvider>
                    {
                        new QueryStringRequestCultureProvider(),
                        new CookieRequestCultureProvider()
                    };
});


var app = builder.Build();
var supportedCultures = new[]
            {
                new CultureInfo("vi"),
                new CultureInfo("en"),
                //new CultureInfo("ja"),
            };
app.UseRequestLocalization(new RequestLocalizationOptions
{
    DefaultRequestCulture = new RequestCulture("vi"),
    // Formatting numbers, dates, etc.
    SupportedCultures = supportedCultures,
    // UI strings that we have localized.
    SupportedUICultures = supportedCultures
});
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    //app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();
app.UseSession();


//app.Run();
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
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
app.MapRazorPages();
app.Run();
