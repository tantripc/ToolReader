using ObjectDefine;

namespace EReaderWeb.Models
{
     public class data_paging
    {
        public long? orgid { get; set; }
        public long? topicid { get; set; }
        public int pageSize { get; set; }
        public int totalCount { get; set; }
        public int curentPage { get; set; }
        public string? function_name { get; set; }
    }
    public class data_rate
    {
        public int? max_rate { get; set; }
        public double? value_rate { get; set; }
    }
    public class tree_topic
    {
        public long? ptopicid { get; set; }
    }
    public class org_topic
    {
        public long? orgid { get; set; }
        public string? orgname { get; set; }
    }
    public class tree_doctoc
    {
        public long? Degree { get; set; }
        public List<Bookmark>? Data { get; set; }
    }
}
