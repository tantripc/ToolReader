using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ObjectDefine
{
    public class Bookmark
    {
        public int? Id { get; set; }
        public long? FileId { get; set; }
        public string? SesionName { get; set; }
        public int? PageNum { get; set; }
        public string? Author { get; set; }
        public string? Type { get; set; }
        public string? CustomerId { get; set; }
        public int? Degree { get; set; }
    }

    public class BookmartData
    {
        public int? Status { get; set; }
        public string? Message { get; set; }
        public List<Bookmark> Data { get; set; }
    }

}
