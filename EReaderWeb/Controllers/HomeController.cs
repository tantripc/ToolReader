using EReaderWeb.Models;
using Microsoft.AspNetCore.Mvc;

namespace EReaderWeb.Controllers
{
    public class HomeController : Controller
    {
        //Thông báo lỗi 
        [HttpGet(RewriteURL.LOIDOCSACH + "{Code_error_msg}.html", Name = "Home/Index")]
        public IActionResult Index(int? Code_error_msg)
        {
            string message = string.Empty;
            switch (Code_error_msg)
            {
                case 1:
                    message = "Lỗi đăng nhập 1";
                    break;
                case 2:
                    message = "Lỗi đăng nhập 1";
                    break;
                case 3:
                    message = "Đường dẫn sai hoặc không đúng";
                    break;
                case 4:
                    message = "Bạn không có quyền đọc tài liệu này";
                    break;
                case 5:
                    message = "Lỗi thông tin sách";
                    break;
                case 6:
                    message = "Lỗi api đăng nhập";
                    break;
            }
            ViewBag.message = message;
            return View();
        }
        [Route("error/404")]
        public IActionResult error404()
        {
            return View();
        }
    }
}
