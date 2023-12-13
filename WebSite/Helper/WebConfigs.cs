namespace WebAdmin.Helper
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
        public string? AppName { get; set; }        
        //Api
        public string? WebApiService { get; set; }
        public string? WebApi_clientId { get; set; }
        public string? WebApi_clientSecret { get; set; }
        //Upload
        public string? WebApiFile { get; set; }
        public string? WebApiFileUrl { get; set; }
        public string? WebApiFile_clientId { get; set; }
        public string? WebApiFile_clientSecret { get; set; }
        //Mail
        public string? MailServer { get; set; }
        public string? MailAccount { get; set; }
        public string? MailFrom { get; set; }
        public string? MailAccountPass { get; set; }
        public int? MailSmtpPort { get; set; }
        public bool? MailEnableSSL { get; set; }
        public string? WebApiServiceSendMail { get; set; }

        //config Socket 
        public bool? IsUsingSocket { get; set; }
        public string? WebSocket { get; set; }
        public string? WebSocketPath { get; set; }
        public string? SocketRoom { get; set; }
        // upload file
        public string? UploadPathQuiz { get; set; }
        // ẩn hiện chức thêm, xóa, sửa
        public bool? IsBlockEditBook { get; set; }


    }

}
