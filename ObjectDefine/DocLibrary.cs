namespace ObjectDefine
{
    public class Detailbook
    {
        public string? UserId { get; set; }
        public long? FileId { get; set; }
        public string? FileRowId { get; set; }
        public string? Type { get; set; }
        public string? CustomerId { get; set; }
        public string? Token { get; set; }
    }
    public class Data_Detailbook
    {
        public string? FileRowId { get; set; }
        public string? FileId { get; set; }
        public string? FileName { get; set; }
        public string? FileExt { get; set; }
        public string? Title { get; set; }
        public int? TotalPage { get; set; }
        public int? TotalPageReal { get; set; }
        public string? PageNum { get; set; }
        public string? UrlFile { get; set; }
    }

    public class detailbook_result
    {
        public int? Status { get; set; }
        public string? Message { get; set; }
        public Data_Detailbook? Data { get; set; }
    }
    public class library : generalmodels
    {
        // Properties
        public string? access_token { get; set; }
        public string? token_type { get; set; }
        public int? expires_in { get; set; }
        public string? UserName { get; set; }
        public string? UserType { get; set; }
        public string? FullName { get; set; }
        public string? UrlImage { get; set; }
    }
    public class errors
    {
        public string? error { get; set; }
        public string? error_description { get; set; }
    }

    public class user_library : generalmodels
    {
        // Properties
        public string? access_token { get; set; }
        public string? token_type { get; set; }
        public int? expires_in { get; set; }
        public string? UserName { get; set; }
        public string? UserType { get; set; }
        public string? FullName { get; set; }
        public string? UrlImage { get; set; }
    }
    public class user_library_errors
    {
        public string? error { get; set; }
        public string? error_description { get; set; }
    }
    public class Image_API
    {
        public string? widthtimage { get; set; }
        public string? heightimage { get; set; }
        public string? heightimagethumbnail { get; set; }
        public string? widthtimagethumbnail { get; set; }
    }
    public class JsonFile
    {
        public string? content { get; set; }
        public long? pageindex { get; set; }

    }
}
