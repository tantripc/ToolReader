using System.ComponentModel.DataAnnotations;

namespace EReaderWeb.Models
{
    public class ReturnExecute
    {
        [Key]
        public int? returncode { get; set; }
        public string? returnmsg { get; set; }
        public int? id { get; set; }
        public string? forgotpwdcode { get; set; }
        public string? activationcode { get; set; }
        public string? detail_notify { get; set; }
        public string? emailaddr { get; set; }
        public string? fullname { get; set; }
     
    }
    public class ReturnSession : ReturnExecute
    {
        public string? tokenkey { get; set; }
        public long userid { get; set; }
    }
    public class ReturnNotify : ReturnExecute
    {
        public int? _notifysend { get; set; }
        public int? _notifyrecv { get; set; }
        public int? _notifyrecv_userid { get; set; }
        public string? _connectionid { get; set; }
        public string? _mess { get; set; }
    }
    
}
