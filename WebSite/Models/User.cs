namespace WebAdmin.Models
{
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    public class User
    {
        public bool signinoauth { get; set; }
        public string username { get; set; }
        public string emailaddr { get; set; }
        public string pwd { get; set; }
        public bool isactivated { get; set; }
        public bool isblocked { get; set; }
        public bool isdeleted { get; set; }
        public string providername { get; set; }
        public string provideruserid { get; set; }
    }


}
