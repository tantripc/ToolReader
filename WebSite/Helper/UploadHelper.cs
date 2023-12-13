using Microsoft.AspNetCore.Hosting;
using System.Drawing;
using System.Xml;

namespace WebAdmin.Helper
{
    public class UploadHelper
    {
        private readonly IWebHostEnvironment? _env;

        public UploadHelper(IWebHostEnvironment? env)
        {
            _env = env;
        }   
        //public static dynamic UploadFile(IFormFile file, bool? isExists, string? subFolder, string? uploadPath = null, string[]? allowExtention = null, long? maxSize = 5242880, bool? isScaleImage = false)
        //{
        //    if (!string.IsNullOrEmpty(subFolder))
        //    {
        //        //return new { ReturnCode = "503" };
        //        subFolder = subFolder.Trim('\\').Trim('/') + "/";
        //    }

        //    string? strUploads = (String.IsNullOrEmpty(uploadPath) ? Path.Combine("Upload") : uploadPath) + subFolder;

        //    string UploadUrl = GFunction.GetFullHttpFolder("UploadUrl");

        //    try
        //    {
        //        if (file != null)
        //        {
        //            if (!System.IO.Directory.Exists(strUploads))
        //            {
        //                System.IO.Directory.CreateDirectory(strUploads);
        //            }

        //            if (allowExtention == null)
        //            {
        //                allowExtention = new[] { ".jpg", ".jpeg", ".png", ".bmp", ".gif" };
        //            }

        //            allowExtention = allowExtention.Where(item => item != null).Select(item => item.ToLower()).ToArray();

        //            var fileExt = "." + System.IO.Path.GetExtension(file.FileName.ToLower()).Substring(1);
        //            if (!allowExtention.Contains(fileExt))
        //            {
        //                return new { ReturnCode = "500" };
        //            }

        //            if (file.Length > maxSize)
        //            {
        //                return new { ReturnCode = "501" };
        //            }

        //            if (file.Length > 0)
        //            {
        //                string filename = Path.GetFileName(file.FileName).ToString();
        //                int indexof = filename.LastIndexOf(".");
        //                string name = GFunction.FormatFileName(filename.Substring(0, indexof));

        //                if (string.IsNullOrEmpty(name))
        //                {
        //                    return new { ReturnCode = "507" };
        //                }

        //                if (isExists)
        //                {
        //                    if (System.IO.File.Exists(strUploads + name + fileExt.ToLower()))
        //                    {
        //                        return new { ReturnCode = "505", FileName = name + fileExt.ToLower(), PathFileName = subFolder + name + fileExt.ToLower(), FullPath = UploadUrl + subFolder + name + fileExt.ToLower() };
        //                    }
        //                }

        //                int k = 0;
        //                string newName = name;
        //                var checkFIleExist = Path.Combine(strUploads, name + fileExt.ToLower());
        //                do
        //                {
        //                    if (System.IO.File.Exists(checkFIleExist))
        //                    {
        //                        k++;
        //                        newName = name + "-" + k;
        //                        checkFIleExist = Path.Combine(strUploads, newName + fileExt.ToLower());
        //                    }
        //                }
        //                while (System.IO.File.Exists(checkFIleExist));

        //                var path = Path.Combine(strUploads, newName + fileExt.ToLower());
        //                file.SaveAs(path);
        //                if (System.IO.File.Exists(path))
        //                {
        //                    if (isScaleImage)
        //                    {
        //                        FileInfo filenew = new FileInfo(path);
        //                        var allowExtentionnew = new[] { ".jpg", ".jpeg", ".png", ".bmp", ".gif" };
        //                        if (allowExtentionnew.Contains(filenew.Extension))
        //                        {
        //                            //Image img = Image.FromFile(filenew.FullName);

        //                            using (var img = System.Drawing.Image.FromFile(filenew.FullName))
        //                            {
        //                                foreach (var prop in img.PropertyItems)
        //                                {
        //                                    if (prop.Id == 0x0112) //value of EXIF
        //                                    {
        //                                        int orientationValue = img.GetPropertyItem(prop.Id).Value[0];
        //                                        RotateFlipType rotateFlipType = GetOrientationToFlipType(orientationValue);
        //                                        img.RotateFlip(rotateFlipType);
        //                                        break;
        //                                    }
        //                                }
        //                                var newImage = ScaleImage(img, XMLReader.ReadInt("MaxImageSize"), XMLReader.ReadInt("MaxImageSize"));
        //                                img.Dispose();
        //                                newImage.Save(path);
        //                            }
        //                        }
        //                    }
        //                    return new
        //                    {
        //                        ReturnCode = "0",
        //                        FileName = newName + fileExt.ToLower(),
        //                        PathFileName = subFolder + newName + fileExt.ToLower(),
        //                        FullPath = UploadUrl + subFolder + newName + fileExt.ToLower(),
        //                        FileSize = file.ContentLength,
        //                        TimeUpload = DateTime.Now
        //                    };
        //                }
        //            }
        //            else
        //            {
        //                return new { ReturnCode = "502" };
        //            }
        //        }
        //        else
        //        {
        //            return new { ReturnCode = "502" };
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return new { ReturnCode = "504", Message = ex.Message };
        //    }
        //    return new { ReturnCode = "504" };
        //}
    }
}
