using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ObjectDefine
{
    public class return_data
    {
    }
    public class returnexecute
    {
        [Key]
        public int returncode { get; set; }
        public string returnmsg { get; set; }
        public int? id { get; set; }
    }
    public class returnuploadscorm : returnexecute
    {
        public string otherval { get; set; }
    }
    public class returnwithnotify : returnexecute
    {
        public List<returnnotify> notifyjs { get; set; }
    }
    public class returnnotify
    {
        public long? notifyid { get; set; }
        public string connectionid { get; set; }
    }
    public class returnpayment : returnexecute
    {
        public long? payorderid { get; set; }
        public string ordercode { get; set; }
    }
    public class returndiscountcode : returnexecute
    {
        public string discount_code { get; set; }
        public double discount_amount { get; set; }
        public DateTime expiry_date { get; set; }
        public long total { get; set; }
    }
    public class returndiscountvalid : returnexecute
    {
        public long? discount_amount { get; set; }
        public string discount_error_msg { get; set; }
    }
    public class returnfogotpass : returnexecute
    {
        public string returnforgotcode { get; set; }
    }
    public class returnsigin : returnexecute
    {
        public bool? isrequirechangepass { get; set; }
        public bool? isactivated { get; set; }
    }
    public class returnsignup : returnexecute
    {
        public string returnemailaddr { get; set; }
        public string returnactivationcode { get; set; }
    }
    public class returngenerate : returnexecute
    {
        public string idjs { get; set; }
        public int totalsuccess { get; set; }
    }
    public class returnqti : returnexecute
    {
        public long? course_learnertaskid { get; set; }
        public int? qnrid { get; set; }
        public string qnr_name { get; set; }
        public string qnr_code { get; set; }
        public bool? isclosed { get; set; }
        public int? total_time { get; set; }
        public int? total_question { get; set; }
        public DateTime? date_taken { get; set; }
        public DateTime? date_last_save { get; set; }
        public bool? ispass { get; set; }
        public double? score { get; set; }
        public int? num_correct { get; set; }
        public int? num_incorrect { get; set; }
        public int? num_noanswer { get; set; }
        public string exercise_name { get; set; }
        public string answer_content { get; set; }
        public string learner_task_path { get; set; }
        public long? v_testtype { get; set; }
        public bool? ismark { get; set; }
        public string mark_content { get; set; }
        public long? markby { get; set; }
        public DateTime? markdate { get; set; }
        public bool? isarchive { get; set; }
    }
    public class return_linkfile : returnexecute
    {
        public string link { get; set; }
    }
    //public class return_import : returnexecute
    //{
    //    public int? numok { get; set; }
    //    public int? numerr { get; set; }
    //    public string ordinal { get; set; }
    //    public string emailaddr { get; set; }
    //}
}
