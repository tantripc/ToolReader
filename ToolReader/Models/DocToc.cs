using System.ComponentModel.DataAnnotations;

namespace WebApi.Models
{
    public class doctoc : generalmodels
    {
        public long? doctocid { get; set; }
        public long? docattachid { get; set; }
        public long? pdoctocid { get; set; } // parent id
        public string? title { get; set; }

        [Display(Description = "'p': page; 'l': link")]
        public string? act { get; set; }

        [Display(Description = "tuy vao action, gotoref se co gia tri la page_number hoac link, bookmark, ...")]
        public string? gotoref { get; set; }

        public int? ordinal { get; set; }
        public int? level { get; set; }
        public long? createdby { get; set; }
        public long? modifiedby { get; set; }
        public long? deletedby { get; set; }
    }

    public class doctoc_import : generalmodels
    {
        public long? docattachid { get; set; }
        public string? doctoc_jss { get; set; }
        public List<doctoc> doctoc_js { get; set; }
        public long? createdby { get; set; }
    }
}
