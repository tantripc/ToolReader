namespace EReaderWeb.Helper
{
    public static class WebConfigs
    {
        public static string? WebRootPath;
        public static string? ContentRootPath;
        public static AppSettings? AppSettings;
    }
    public class AppSettings
    {
        //Info Domain
        public string? DomainName { get; set; }
        //Upload
        public string? WebApiFileUrl { get; set; }
        public string? WebApiFile { get; set; }
        public string? WebApiFile_clientId { get; set; }
        public string? WebApiFile_clientSecret { get; set; }
        //Api
        public string? WebApiService { get; set; }
        public string? WebApiServiceLibrary { get; set; }
        public string? WebApi_clientId { get; set; }
        public string? WebApi_clientSecret { get; set; }
        public string? OfficeViewerUrl { get; set; }
        public string? UrlReadOnline { get; set; }
        public string? UrlReadOnlineEncode { get; set; }
        public string? AppName { get; set; }
        public string? Ereader { get; set; }
        public string? Help { get; set; }
        public string? Review { get; set; }
        public string? Savefile { get; set; }
        public string? ResourcePath { get; set; }
        public string? ResourceEncodePath { get; set; }
        public string? UrlGetImage { get; set; }
        public string? UrlSaveImage { get; set; }
        public string? ApiLoadImage { get; set; }
        public string? UrlSaveImageLocal { get; set; }
    }

}
