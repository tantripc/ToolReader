using EReaderWeb.Helper;
using EReaderWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;

namespace EReaderWeb.Components
{
    public class TopicTreeViewComponent: ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(tree_topic tree_topic)
        {
            return View("~/Views/Common/TopicTree.cshtml",tree_topic);
        }
    }
}
