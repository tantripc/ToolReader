using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ObjectDefine
{
    public class generalmodels
    {
        public int? sortfield { get; set; }
        public string? sorttype { get; set; }
        public int? posstart { get; set; }
        public int? numofrow { get; set; }
        public int? total { get; set; }
        public string? lang { get; set; }
        public long? appfuncid { get; set; }
        public long? createdby { get; set; }
        public long? getby { get; set; }
        public string? routing { get; set; }

        //public virtual string ToJson() { return ""; }
    }


    public class reflookup : generalmodels
    {
        // Properties
        public long? lookupid { get; set; }
        public string? objectname { get; set; }
        public string? objectvalue { get; set; }
        public string? objectnotes { get; set; }
        public int? ordinal { get; set; }
        public bool? iseffect { get; set; }
        public bool? isbuiltin { get; set; }
        
    }
}
