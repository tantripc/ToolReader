namespace ReadFileOnline.Models
{
    public static class WebConfigs
    {
        public static string? WebRootPath;
        public static string? ContentRootPath;
        public static AppSettings? AppSettings;
    }
    public class AppSettings
    {
        public string? ResourcePath { get; set; }
        public string? ResourceEncodePath { get; set; }
    }
}
