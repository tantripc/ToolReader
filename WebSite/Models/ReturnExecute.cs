using System.ComponentModel.DataAnnotations;

namespace WebAdmin.Models
{
    public class ReturnExecute
    {
        [Key]
        public int? returncode { get; set; }
        public string? returnmsg { get; set; }
        public string? detail_notify { get; set; }
        public int? id { get; set; }
        public string? emailaddr { get; set; }
        public string? fullname { get; set; }
        public string? username { get; set; }
        public int? _notifysend { get; set; }
        public int? _notifyrecv { get; set; }
        public int? _notifyrecv_userid { get; set; }
        public string? forgotpwdcode { get; set; }
        public string? _connectionid { get; set; }
        public string? _mess { get; set; }
        public string? titledoc { get; set; }
        public string? ugname { get; set; }
    }
    public class ReturnSession : ReturnExecute
    {
        public string? tokenkey { get; set; }
        public long? userid { get; set; }
    }
    public class ReturnGenerate : ReturnExecute
    {
        public string idjs { get; set; }
        public int totalsuccess { get; set; }
    }
    public class import_return
    {
        public int? numok { get; set; }
        public int? numerr { get; set; }
        public int? ordinal { get; set; }
        public string? msg { get; set; }
        public string? emailaddr { get; set; }
        public string? username { get; set; }
        public int? returncode { get; set; }
        public string? name { get; set; }
        public string? description { get; set; }
    }
    public class ReturnAddMulti 
    {
        public string? emailaddr { get; set; }
        public string? fullname { get; set; }
        public int? _notifysend { get; set; }
        public int? _notifyrecv { get; set; }
        public int? _notifyrecv_userid { get; set; }
        public string? _connectionid { get; set; }
        public string? _mess { get; set; }
        public int? returncode { get; set; }

    }
}
