using EReaderWeb.Helper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;

namespace EReaderWeb.Components
{
    public class ControlViewerViewComponent : ViewComponent
    {
        Rep_Library Rep_Librarys = new Rep_Library(WebConfigs.AppSettings.WebApiServiceLibrary, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public async Task<IViewComponentResult> InvokeAsync(long? id, string? FileRowId, string? typebook, string? customerid)
        {
            //lấy danh sách bookmark
            Bookmark bookmarks = new Bookmark();
            List<Bookmark> lstbookmarks = new List<Bookmark>();
            BookmartData bookmartdata = new BookmartData();

            bookmarks.Id = (int?)id;
            bookmarks.Type = typebook;
            bookmarks.CustomerId = customerid;
            string res_bookmark = Rep_Librarys.getbookmark(bookmarks);
            BookmartData data_res_bookmark = JsonConvert.DeserializeObject<BookmartData>(res_bookmark);
            if (data_res_bookmark.Data != null)
            {
                string convert_data_bookmarkes = JsonConvert.SerializeObject(data_res_bookmark.Data);
                if (!string.IsNullOrWhiteSpace(convert_data_bookmarkes))
                {
                    lstbookmarks = JsonConvert.DeserializeObject<List<Bookmark>>(convert_data_bookmarkes);
                }
            }
            ViewBag.lstbookmark = lstbookmarks;
            return View("~/Views/Common/ControlViewer.cshtml", data_res_bookmark);
        }
    }
}
