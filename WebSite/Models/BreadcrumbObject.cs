namespace WebAdmin.Models
{
    public class ListBreadcrumb
    {
        private List<BreadcrumbObject> listNav;

        public List<BreadcrumbObject> ListNav
        {
            get
            {
                return this.listNav;
            }
            set
            {
                this.listNav = value;
            }
        }

        public void Add(BreadcrumbObject item)
        {
            if (this.ListNav == null)
                this.ListNav = new List<BreadcrumbObject>();
            this.ListNav.Add(item);
        }
        public List<BreadcrumbObject> GetList()
        {
            return this.ListNav;
        }
        public void Clear()
        {
            this.ListNav = new List<BreadcrumbObject>();
        }

    }
    public class BreadcrumbObject
    {

        public string name { get; set; }
        public string link { get; set; }
        public BreadcrumbObject(string name, string link="")
        {
            this.name = name;
            this.link = link;
        }
    }
}
