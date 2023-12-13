using OauthAPI;
using ObjectDefine;

namespace RepositoriesAPI
{
    public class Rep_Library
    {
        private string _rootUrlApi;
        private string _clientIdApi;
        private string _clientSecretApi;
        public Rep_Library(string rootUrlApi, string clientIdApi = "", string clientSecretApi = "")
        {
            _rootUrlApi = rootUrlApi;
            _clientIdApi = clientIdApi;
            _clientSecretApi = clientSecretApi;
        }

        private readonly string _Controller = "ViewOnline";
        private readonly string _ControllerAccount = "Account";
        /// <summary>
        /// Lấy thông tin file sách
        /// </summary>
        /// <param name="UserId">username</param>
        /// <param name="FileId">id sách</param>
        /// <param name="FileRowId">id file sách</param>
        /// <param name="Type">tên controller api</param>
        /// <param name="CustomerId">DEFAULT</param>
        /// <returns></returns>
        public string? getdetail(Detailbook detailbooks)
        {
            return new APIResJsonConnect(_rootUrlApi, _clientIdApi, _clientSecretApi).PostL(_Controller, "Index",
                 new Dictionary<string, object>
                 {
                    {"UserId",detailbooks.UserId},
                    {"FileId",detailbooks.FileId},
                    {"FileRowId",detailbooks.FileRowId},
                    {"Type",detailbooks.Type},
                    {"CustomerId",detailbooks.CustomerId}
                 }, detailbooks.Token);
        }
        /// <summary>
        /// Lấy mục lục sách
        /// </summary>
        /// <param name="FileId">12326</param>
        /// <param name="Type">digitaldocument</param>
        /// <param name="CustomerId">DEFAULT</param>
        /// <returns></returns>
        public string? getbookmark(Bookmark bookmarks)
        {
            return new APIResJsonConnect(_rootUrlApi, _clientIdApi, _clientSecretApi).Getlink(_Controller, "GetBookmark",
                 new Dictionary<string, object>
                 {
                    {"type",bookmarks.Type},
                    {"customerId",bookmarks.CustomerId}
                 }, bookmarks.Id.ToString());
        }
        /// <summary>
        /// Lấy hình ảnh
        /// </summary>
        /// <param name="pagenum">số trang</param>
        /// <param name="fileName">tên file</param>
        /// <param name="fileExt">đuôi file</param>
        /// <returns></returns>
        public dynamic LoadImageFileDD(int? pagenum, string? fileName, string? fileExt)
        {
            return new APIResJsonConnect(_rootUrlApi, _clientIdApi, _clientSecretApi).GetFile(_Controller, "LoadImageFileDD",
                 new Dictionary<string, object>
                 {
                    {"pagenum",pagenum},
                    {"fileName",fileName},
                    {"fileExt",fileExt}

                 });
        }
        public string Login(List<KeyValuePair<string, string>> value)
        {
            return new APIResJsonConnect(_rootUrlApi, _clientIdApi, _clientSecretApi).Post_string(_ControllerAccount, "Login", value);

        }

    }
}
