using ReadFileOnline.Models;

var builder = WebApplication.CreateBuilder(args);
ConfigurationManager configuration = builder.Configuration;
IWebHostEnvironment environment = builder.Environment;

// Add services to the container.
builder.Services.AddControllersWithViews();

var settings = builder.Configuration.GetSection("AppSettings").Get<AppSettings>();
//set static WebConfigs
WebConfigs.WebRootPath = environment.WebRootPath;
WebConfigs.ContentRootPath = environment.ContentRootPath;
WebConfigs.AppSettings = settings;

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
