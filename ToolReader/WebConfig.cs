namespace WebApi
{
    public static class WebConfigs
    {
        public static string WebRootPath;
        public static string ContentRootPath;
        public static AppSettings AppSettings;
        public static ConnectionStrings ConnectionStrings;
        public static Authentication Authentication;
    }

    public class AppSettings
    {
        public string? logDir { get; set; }
        public string? IsLogParam { get; set; }
        public string? LogFunctionName { get; set; }
        public bool? PublicSwagger { get; set; }
        //public string FolderResources { get; set; }
        public string? UploadPath { get; set; }
        public string? DocOnlinePath { get; set; }
        public string? FolderResources { get; set; }
        public string? IsEncodeDocOnline { get; set; }
        public string? DocOnlineEncodePath { get; set; }
    }

    public class ConnectionStrings
    {
        public string? DataAccessPostgreSqlProvider { get; set; }
    }

    public class Authentication
    {
        //public string Id { get; set; }
        //public string Secret { get; set; }
        public AuthenticationJwt Jwt { get; set; }
        public List<AuthenticationClients> Clients { get; set; }
    }

    public class AuthenticationJwt
    {
        public string? Key { get; set; }
        public string? Issuer { get; set; }
        public int? TimeoutInMinute { get; set; }
    }

    public class AuthenticationClients
    {
        public string? Id { get; set; }
        public string? Secret { get; set; }
    }
}
