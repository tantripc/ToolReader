using DefineConstants;
using EReaderWeb.Helper;
using EReaderWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;
using System.Drawing;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using Tesseract;

namespace EReaderWeb.Controllers
{
    //[AuthenticateFilter]
    public class BookAttachController : Controller
    {

        private readonly string _ServiceLibrary;
        private readonly string? _ApiLoadImage;
        public BookAttachController()
        {
            _ServiceLibrary = WebConfigs.AppSettings.WebApiServiceLibrary;
            _ApiLoadImage = WebConfigs.AppSettings.ApiLoadImage;
        }
        Rep_Library Rep_Librarys = new Rep_Library(WebConfigs.AppSettings.WebApiServiceLibrary, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);



        [HttpGet(RewriteURL.DOCSACH + "/id={id}&fileRowId={fileRowId}&type={type}-{UserId}-{CustomerId}.html", Name = "BookAttach/Viewer", Order = 1)]
        public async Task<IActionResult> Viewer(long? id, string? FileRowId, string? type, string? UserId, string? CustomerId)
        {


            //đường dẫn thư mục

            string _UrlSaveImage = WebConfigs.AppSettings?.UrlSaveImage + Regex.Replace(Request.Host.Value.ToString(), @"[^a-zA-Z0-9]", string.Empty) + "/" + type;
            string _UrlSaveImageLocal = WebConfigs.AppSettings?.UrlSaveImageLocal + Regex.Replace(Request.Host.Value.ToString(), @"[^a-zA-Z0-9]", string.Empty) + "/" + type;


            //Modal 
            Data_Detailbook? data_detailbooks = new Data_Detailbook();
            Detailbook? detailbooks = new Detailbook();
            List<KeyValuePair<string, string>> value = new List<KeyValuePair<string, string>>();
            detailbook_result detailbook_results = new detailbook_result();


            detailbooks.FileId = id;//Id file sách 
            detailbooks.CustomerId = CustomerId;//Id của đơn vị triển khai
            detailbooks.Type = type;// type :digitaldocument =>> sách ; Serial báo chí ;Article tạp chí;
            string username = "";
            string password = "";


            //Kiểm tra UserId khác null 
            if (!string.IsNullOrEmpty(UserId))
            {

                string decode_user_pw = Encoding.UTF8.GetString(Convert.FromBase64String(UserId));
                var array_user_pwd = decode_user_pw.Split(";");


                //kiểm tra mảng str_pass null hoặc rỗng
                if (array_user_pwd.Length > 0)
                {
                    username = array_user_pwd[0];
                    password = doCode(0, array_user_pwd[1]);

                }
                else
                {   //Code_error_msg = 1 => Lỗi đăng nhập 1
                    return RedirectToAction("Index", "Home", new { Code_error_msg = 1 });
                }

                //================= Gọi API đăng nhập =================
                value.Add(new KeyValuePair<string, string>("grant_type", "password"));
                value.Add(new KeyValuePair<string, string>("UserName", username));
                value.Add(new KeyValuePair<string, string>("Password", password));
                value.Add(new KeyValuePair<string, string>("scope", CustomerId));
                string reslogin = Rep_Librarys.Login(value);
                if (!string.IsNullOrEmpty(reslogin))
                {
                    library obj_library = new library();
                    obj_library = JsonConvert.DeserializeObject<library>(reslogin);
                    ViewBag.UserName = obj_library?.UserName;
                    detailbooks.Token = obj_library?.access_token;
                    detailbooks.UserId = obj_library?.UserName;
                    detailbooks.FileRowId = FileRowId;
                }
                else
                {
                    //Code_error_msg = 2 => Lỗi đăng nhập 2
                    return RedirectToAction("Index", "Home", new { Code_error_msg = 2 });
                }

            }
            else if (UserId == "bHY7")
            {
                ViewBag.NoAuth = "NoAuth";
            }
            else
            {   //Code_error_msg = 3 => Đường dẫn sai hoặc không đúng
                return RedirectToAction("Index", "Home", new { Code_error_msg = 3 });
            }


            string name_file = "ViewerPDF";


            int height = 1125; // Chiều dài khung hình 
            int width = 793;// Chiều rộng khung hình 


            //api thông tin sách 
            string? res_detailbook = Rep_Librarys.getdetail(detailbooks);

            if (!string.IsNullOrEmpty(res_detailbook))
            {
                //Parse res_detailbook => Object detailbook_result == detailbook_results
                detailbook_results = JsonConvert.DeserializeObject<detailbook_result>(res_detailbook);

                //Kiểm tra detailbook_results khác null && detailbook_results.Data khác null
                if (detailbook_results != null && detailbook_results.Data != null)
                {

                    //Parse detailbook_results.Data => Object Data_Detailbook == data_detailbooks
                    data_detailbooks = JsonConvert.DeserializeObject<Data_Detailbook>(JsonConvert.SerializeObject(detailbook_results.Data).ToString());



                    //Kiểm tra data_detailbooks khác null
                    if (data_detailbooks != null)
                    {

                        if (data_detailbooks.TotalPage != 0)
                        {
                            ViewBag.totalpage = data_detailbooks.TotalPage > 10 ? data_detailbooks.TotalPageReal : data_detailbooks.TotalPage;
                        }
                        else
                        {
                            //Code_error_msg = 5 => Lỗi thông tin sách
                            return RedirectToAction("Index", "Home", new { Code_error_msg = 5 });
                        }




                        //Đường dẫn thư mục Image
                        string Folder_UrlImageSave_FileId = _UrlSaveImage + "/" + data_detailbooks.FileId + "/" + "image";
                        //Đường dẫn thư mục ImageThumbnail
                        string Folder_ImageThumbSave_FileId = _UrlSaveImage + "/" + data_detailbooks.FileId + "/" + "imagethumbnail";
                        //Đường dẫn thư mục File Json
                        string Folder_Json = _UrlSaveImage + "/" + data_detailbooks.FileId + "/" + "json";

                        string Folder_User = Folder_Json + "/" + username;

                        ViewBag.folder_image = Folder_UrlImageSave_FileId;
                        ViewBag.folder_json = Folder_Json;
                        ViewBag.folder_image_thumb = Folder_ImageThumbSave_FileId;
                        ViewBag.folder_user = Folder_User;



                        //check file serve
                        string[]? GetImage_FileName = null;
                        if (!string.IsNullOrEmpty(data_detailbooks.UrlFile))
                        {
                            GetImage_FileName = data_detailbooks.UrlFile.Split("/");
                        }
                        else
                        {
                            //Code_error_msg = 6 => Lỗi đường dẫn file 
                            return RedirectToAction("Index", "Home", new { Code_error_msg = 6 });
                        }

                        string? fileName_Image = GetImage_FileName[GetImage_FileName.Length - 1];

                        ViewBag.fileName_Image = fileName_Image;

                        ViewBag.fileExt = data_detailbooks.FileExt;

                        int pagenum = 5;
                        switch (data_detailbooks.FileExt)
                        {
                            case ".azw3":
                                name_file = "ViewerAZW";
                                ViewBag.UrlFileazw3 = _ServiceLibrary.TrimEnd('/') + data_detailbooks.UrlFile;
                                break;
                            case ".epub":
                                name_file = "ViewerEPUB";
                                ViewBag.UrlFileEpub = _ServiceLibrary.TrimEnd('/') + data_detailbooks.UrlFile;
                                break;
                            case ".mobi":
                                name_file = "ViewerMOBI";
                                ViewBag.UrlFileMobi = _ServiceLibrary.TrimEnd('/') + data_detailbooks.UrlFile;
                                break;
                            case ".prc": name_file = "ViewerMOBI"; break;
                            case ".ppt": name_file = "ViewerPPT"; break;
                            case ".pptx": name_file = "ViewerPPT"; break;
                            case ".docx": name_file = "Viewer"; break;
                            case ".doc": name_file = "Viewer"; break;
                            case ".mp3": name_file = "ViewerAudio"; break;
                            case ".mp4": name_file = "ViewerMedia"; break;
                            case ".m3u8": name_file = "ViewerMedia"; break;
                            default: name_file = "Viewer"; break;
                        }
                        if (data_detailbooks.FileExt == ".pdf" || data_detailbooks.FileExt == ".docx" || data_detailbooks.FileExt == ".doc")
                        {

                            //api lấy hình ảnh
                            ViewBag.UrlFilePdf = _ApiLoadImage + "pagenum=__pagenumber__&fileName=" + fileName_Image + "&fileExt=.pdf";

                            //đường dẫn lấy hình trong thư mục
                            ViewBag.UrlFilePdfLocal = _UrlSaveImageLocal + "/" + data_detailbooks.FileId + "/" + "image" + "/__pagenumber__.png";


                            bool isfolder = await WebCultures.DoesUrlExists(Folder_UrlImageSave_FileId);
                            if (!isfolder)
                            {
                                ViewBag.Islink = false;
                                Directory.CreateDirectory(Folder_UrlImageSave_FileId);//Tạo đường dẫn thư mục Image
                                Directory.CreateDirectory(Folder_ImageThumbSave_FileId);//Tạo đường dẫn thư mục ImageThumbnail
                                Directory.CreateDirectory(Folder_Json);//Tạo đường dẫn thư mục Json
                                Directory.CreateDirectory(Folder_User);//Tạo đường dẫn thư mục Json


                                var rep = Rep_Librarys.LoadImageFileDD(pagenum, fileName_Image, data_detailbooks.FileExt);
                                if (!string.IsNullOrEmpty(rep.ToString()))
                                {
                                    Stream response = await rep.Content.ReadAsStreamAsync();
                                    if (response.Length != 0 && response != null)
                                    {
                                        byte[] fileContents = new byte[response.Length];
                                        response.Read(fileContents, 0, (int)response.Length);
                                        using (Image img = Image.FromStream(new MemoryStream(fileContents)))
                                        {
                                            Bitmap objBitmap = new(img, new Size(width, height));
                                            ViewBag.Widht = objBitmap.Width;
                                            ViewBag.Height = objBitmap.Height;
                                        }
                                    }
                                }
                            }
                            else
                            {
                                ViewBag.Islink = true;
                                using (WebClient client = new WebClient())
                                {
                                    byte[] bytes = client.DownloadData(Folder_UrlImageSave_FileId + "/" + pagenum + ".png");
                                    if (bytes != null && bytes.Length != 0)
                                    {
                                        using (Image img = Image.FromStream(new MemoryStream(bytes)))
                                        {
                                            Bitmap objBitmap = new(img, new Size(width, height));
                                            ViewBag.Widht = objBitmap.Width;
                                            ViewBag.Height = objBitmap.Height;
                                        }
                                    }
                                }

                            }
                        }

                    }
                }
                else
                {
                    return RedirectToAction("Index", "Home", new { Message = detailbook_results.Message });
                }
            }
            else
            {
                //Code_error_msg = 4 => Bạn không có quyền đọc tài liệu này
                return RedirectToAction("Index", "Home", new { Code_error_msg = 4 });
            }


            ViewBag.FileRowId = FileRowId;
            ViewBag.FileId = id;
            ViewBag.type = type;
            ViewBag.UserId = UserId;
            ViewBag.CustomerId = CustomerId;
            return View("~/Views/BookAttach/" + name_file + ".cshtml", data_detailbooks);
        }



        /// <summary>
        /// save note
        /// </summary>
        /// <returns></returns>
        public JsonResult ViewerDocnote()
        {

            return Json(new { data = 0 });
        }


        /// <summary>
        /// save bookmark
        /// </summary>
        /// <returns></returns>
        public JsonResult ViewerBookmark()
        {

            return Json(new { data = 0 });
        }

        /// <summary>
        /// save image
        /// </summary>
        /// <param name="pagenum"></param>
        /// <param name="fileName_Image"></param>
        /// <param name="fileExt"></param>
        /// <param name="FileId"></param>
        /// <param name="Islink"></param>
        /// <param name="type"></param>
        /// <param name="folder_image"></param>
        /// <returns>file image</returns>
        [HttpGet]
        public async Task<JsonResult> SaveImageAPI(int? pagenum, string? fileName_Image, string? fileExt, string? FileId, bool? Islink, string? type, string? folder_image)
        {
            string strImageFileFull = folder_image + "/" + FileId + "/" + "image" + "/" + pagenum + ".png";
            //tạo file ảnh thumbnail
            string strImageFileFullThumnail = folder_image + "/" + FileId + "/" + "imagethumbnail" + "/" + pagenum + ".png";
            //tạo file text 



            if (Islink == false || fileName_Image != null || fileExt != null || FileId != null)
            {
                //gọi api lấy file ảnh
                var rep = Rep_Librarys.LoadImageFileDD(pagenum, fileName_Image, fileExt);
                //khởi tạo biến nhận filecontent 
                Stream response = await rep.Content.ReadAsStreamAsync();
                if (response.Length > 0 && response != null)
                {
                    byte[] fileContents = new byte[response.Length];
                    response.Read(fileContents, 0, (int)response.Length);
                    Image image = Image.FromStream(new MemoryStream(fileContents));
                    //resize ảnh 
                    Bitmap objBitmap = new(image, new Size(793, 1125));
                    //resize ảnh thumbnal
                    Bitmap objBitmapthumnail = new(image, new Size(169, 250));
                    objBitmapthumnail.Save(strImageFileFullThumnail);
                    objBitmap.Save(strImageFileFull);
                }
                return Json(new { returncode = 1 });
            }
            else
            {
                return Json(new { returncode = 0 });
            }

        }


        /// <summary>
        /// get image 
        /// </summary>
        /// <param name="url"></param> link api
        /// <returns>file image</returns>
        [HttpGet]
        public IActionResult GetStreamFile(string url)
        {
            byte[] fileData = null;
            using (var wc = new WebClient())
                fileData = wc.DownloadData(url);

            return File(new MemoryStream(fileData), "application/octet-stream");
        }


        /// <summary>
        /// get image thumbnail
        /// </summary>
        /// <param name="url"></param> link api
        /// <returns>file image thumbnail</returns>
        [HttpGet]
        public IActionResult GetStreamFileThumbnail(string url)
        {
            byte[] fileData = null;
            using (var wc = new WebClient())
                fileData = wc.DownloadData(url);
            Image image = Image.FromStream(new MemoryStream(fileData));
            Bitmap objBitmapthumnail = new(image, new Size(169, 250));
            MemoryStream ms = new MemoryStream();
            objBitmapthumnail.Save(ms, System.Drawing.Imaging.ImageFormat.Gif);
            return File(new MemoryStream(ms.ToArray()), "application/octet-stream");
        }


        /// <summary>
        /// Decode get username && password
        /// </summary>
        /// <param name="pType">0</param>
        /// <param name="pStr">UserId</param> string encode
        /// <returns>string decode</returns>
        #region Function decode username and password form url 

        public static string codeMove(int pType, string pStr)
        {
            int mLen, i, mAscii;
            string mDest;
            mLen = pStr.Length;
            mDest = "";
            if (pType == 1)
            {
                for (i = 0; i < mLen; i++)
                {
                    mDest = mDest + (char)((Char.ConvertToUtf32(pStr.Substring(i, 1), 0) + 66) % 256);
                }
            }
            else
            {
                for (i = 0; i < mLen; i++)
                {
                    mAscii = Char.ConvertToUtf32(pStr.Substring(i, 1), 0);
                    if (mAscii < 66)
                    {
                        mDest = mDest + (char)(mAscii + 190);
                    }
                    else
                    {
                        mDest = mDest + (char)(mAscii - 66);
                    }
                }
            }
            return mDest;
        }
        public static string doCode(int pType, string strSrc)
        {
            string mSpecial, mSourceStr, mDest, mTam;
            int mLen, mMax, mDem;
            bool mExit;
            mSpecial = ",";
            mSourceStr = strSrc;
            mLen = mSourceStr.Length;
            if (pType == 1)
            {
                mSourceStr = codeMove(1, mSourceStr);
            }
            //-----Xac dinh kich thuoc Ma tran
            int i = 1;
            while (true)
            {
                if ((i * i) >= mLen)
                {
                    break;
                }
                i++;
            }

            mMax = i;
            //-----Khai bao Ma tran va Gan tri cua mSourceStr vao-----------------*
            string[,] ma = new string[mMax, mMax];
            for (i = 0; i < mMax; i++)
            {
                for (int j = 0; j < mMax; j++)
                {
                    ma[i, j] = mSpecial;
                }
            }
            mDem = 0;
            mExit = false;
            for (i = 0; i < mMax; i++)
            {
                for (int j = 0; j < mMax; j++)
                {
                    if (mDem < mLen)
                    {
                        ma[i, j] = mSourceStr.Substring(mDem, 1);
                    }
                    if (mDem == mLen)
                    {
                        mExit = true;
                        break;
                    }
                    else
                    {
                        mDem = mDem + 1;
                    }

                }
                if (mExit)
                {
                    break;
                }

            }
            //-------Hoan vi Ma tran (Hang-->Cot)
            for (i = 0; i < mMax; i++)
            {
                for (int j = i; j < mMax; j++)
                {
                    mTam = ma[i, j];
                    ma[i, j] = ma[j, i];
                    ma[j, i] = mTam;
                }
            }
            //--------Doc lai Ma tran da bi Hoan vi vao mDest
            mDest = "";
            if (pType == 1)
            {
                //---Code
                for (i = 0; i < mMax; i++)
                {
                    for (int j = 0; j < mMax; j++)
                    {
                        mDest = mDest + ma[i, j];
                    }
                }
            }
            else
            {
                //---Decode
                mExit = false;
                for (i = 0; i < mMax; i++)
                {
                    for (int j = 0; j < mMax; j++)
                    {
                        if (ma[i, j] != mSpecial)
                        {
                            mDest = mDest + ma[i, j];
                        }
                        else
                        {
                            mExit = true;
                            break;
                        }
                    }
                    if (mExit)
                    {
                        break;
                    }
                }
                mDest = codeMove(2, mDest);
            }
            return mDest;

        }

        #endregion

        /// <summary>
        ///  Detect text to image
        /// </summary>
        /// <param name="fileid"></param>
        /// <param name="totalpage"></param>
        /// <param name="type"></param>
        /// <param name="folder_json"></param>
        /// <param name="folder_image"></param>
        /// <returns>filejson text</returns>
        [HttpPost]
        public Task<JsonResult> GenerateText(long? fileid, int? totalpage, string? type, string folder_json, string folder_image)
        {

            string file_json = folder_json + "/text" + fileid + ".json";

            List<JsonFile> contentData = new List<JsonFile>();

            for (int i = 1; i <= totalpage; i++)
            {
                string strImageFileFull = folder_image + "/" + i + ".png";

                bool isfolder = System.IO.File.Exists(strImageFileFull);

                if (isfolder == true)
                {
                    string content = PubFunc.RemoveSpecialcharacters(DetectText(strImageFileFull)).Trim();
                    JsonFile jsonFile = new JsonFile();
                    jsonFile.pageindex = i;
                    jsonFile.content = content;
                    contentData.Add(jsonFile);
                }
            }
            string ContentTextImage = JsonConvert.SerializeObject(contentData);

            System.IO.File.WriteAllText(file_json, ContentTextImage, Encoding.UTF8);

            return Task.FromResult(Json(new { data = 1 }));
        }
        public static string DetectText(string imagePath)
        {
            // Khởi tạo đối tượng Tesseract và cấu hình
            using (var engine = new TesseractEngine(@"./tessdata", "Vietnamese", EngineMode.Default))
            {
                using (var image = Pix.LoadFromFile(imagePath))
                {
                    using (var page = engine.Process(image))
                    {
                        var result = page.GetText();
                        return result;
                    }
                }
            }
        }
    }
}
