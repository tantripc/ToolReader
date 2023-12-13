using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Http.Internal;
//using ICSharpCode.SharpZipLib.Zip;
using System.Net.Mime;
using MimeTypes;
using Microsoft.AspNetCore.StaticFiles;

namespace WebApi.App_Code
{
    public class FileUtil
    {
        //public FileUtil()
        //{
        //}

        public static bool IsNumberString(string strString)
        {
            if (string.IsNullOrEmpty(strString))
                return false;
            for (int i = 0; i < strString.Length; i++)
            {
                if (!char.IsNumber(strString[i]))
                    return false;
            }
            return true;
        }

        public static string GenUniqueFileName(string strFullPathName)
        {
            if (string.IsNullOrEmpty(strFullPathName) || !File.Exists(strFullPathName))
                return strFullPathName;

            string strFileNameWithoutExtension = Path.GetFileNameWithoutExtension(strFullPathName);
            if (strFileNameWithoutExtension.Equals(""))
                return strFullPathName;

            int iOrdinal = 1;
            if (strFileNameWithoutExtension.Substring(strFileNameWithoutExtension.Length-1, 1) == "]")
            {
                int iIdx = strFileNameWithoutExtension.LastIndexOf("[");
                if (iIdx >= 0)
                {
                    string strNum = strFileNameWithoutExtension.Substring(iIdx+1, strFileNameWithoutExtension.Length-1-iIdx-1);
                    if (strNum.Equals(""))
                    {
                        iOrdinal = 1;
                        strFileNameWithoutExtension = strFileNameWithoutExtension.Substring(0, iIdx);
                    }
                    else if (IsNumberString(strNum))
                    {
                        iOrdinal = int.Parse(strNum)+1;
                        strFileNameWithoutExtension = strFileNameWithoutExtension.Substring(0, iIdx);
                    }
                }
            }

            while (iOrdinal < 100)
            {
                if (!File.Exists(Path.GetDirectoryName(strFullPathName) + Path.DirectorySeparatorChar + strFileNameWithoutExtension + "[" + iOrdinal.ToString() + "]" + Path.GetExtension(strFullPathName)))
                    return Path.GetDirectoryName(strFullPathName) + Path.DirectorySeparatorChar + strFileNameWithoutExtension + "[" + iOrdinal.ToString() + "]" + Path.GetExtension(strFullPathName);
                iOrdinal++;
            }
            return Path.GetDirectoryName(strFullPathName) + Path.DirectorySeparatorChar + strFileNameWithoutExtension + "[" + iOrdinal.ToString() + "]" + Path.GetExtension(strFullPathName);
        }

        public static string GenUniqueFolderName(string strFullFolderName)
        {
            if (string.IsNullOrEmpty(strFullFolderName) || !Directory.Exists(strFullFolderName))
                return strFullFolderName;

            bool bSeparatorChar = false;
            if (strFullFolderName[strFullFolderName.Length - 1] == '\\')
            {
                strFullFolderName = strFullFolderName.TrimEnd('\\');
                bSeparatorChar = true;
            }

            int iOrdinal = 1;
            if (strFullFolderName.Substring(strFullFolderName.Length - 1, 1) == "]")
            {
                int iIdx = strFullFolderName.LastIndexOf("[");
                if (iIdx >= 0)
                {
                    string strNum = strFullFolderName.Substring(iIdx + 1, strFullFolderName.Length - 1 - iIdx - 1);
                    if (strNum.Equals(""))
                    {
                        iOrdinal = 1;
                        strFullFolderName = strFullFolderName.Substring(0, iIdx);
                    }
                    else if (IsNumberString(strNum))
                    {
                        iOrdinal = int.Parse(strNum) + 1;
                        strFullFolderName = strFullFolderName.Substring(0, iIdx);
                    }
                }
            }

            while (iOrdinal < 100)
            {
                if (!Directory.Exists(strFullFolderName + "[" + iOrdinal.ToString() + "]"))
                    return strFullFolderName + "[" + iOrdinal.ToString() + "]" + (bSeparatorChar ? "\\" : "");
                iOrdinal++;
            }
            return strFullFolderName + "[" + iOrdinal.ToString() + "]" + (bSeparatorChar ? "\\" : "");
        }

        public static IFormFile ReturnFormFile(FileStreamResult result)
        {
            var ms = new MemoryStream();
            try
            {
                result.FileStream.CopyTo(ms);
                return new FormFile(ms, 0, ms.Length, Guid.NewGuid().ToString(), Guid.NewGuid().ToString() + ".png");
            }
            finally { }
        }

        /*
        public static string GetlinkUploadFile(Stream filezip, string pathname, bool isunzip)
        {
            //pathname: đường dẫn file hình.
            string rootMinIO = Config.ReadConfig("AppSettings:WebApiMinIO_root");
            string tempDir = Config.ReadConfig("AppSettings:TempDir");
            string uuid = Guid.NewGuid().ToString();
            uuid = uuid.Replace("-", "_");
            if (isunzip)
            {
                string strTargetDirectory = "";
                try
                {
                    //save zip to disk;
                    FileStream fss = new FileStream(tempDir + uuid + ".zip", FileMode.OpenOrCreate);//lưu file zip xuống thư mục tạm.
                    filezip.Seek(0, SeekOrigin.Begin);
                    filezip.CopyTo(fss);
                    fss.Close();
                    //unzip to file in disk;
                    string zipPath = tempDir + uuid + ".zip";
                    strTargetDirectory = tempDir + @"\ExtrackFile";
                    System.IO.Directory.CreateDirectory(strTargetDirectory);//Tạo thư mục mới
                    System.IO.Compression.ZipFile.ExtractToDirectory(zipPath, strTargetDirectory);//giải nén file zip ra thư mục vừa tạo.
                    System.IO.File.Delete(zipPath);//Xoá file zip.
                }
                catch (Exception ex) { }

                //get link from minIO;
                string filepath = strTargetDirectory + "/" + pathname;
                string strPathQSB = "";
                FileStream fs = new FileStream(filepath, FileMode.OpenOrCreate);
                var fsResult = new FileStreamResult(fs, MediaTypeNames.Image.Jpeg);
                IFormFile ifi = ReturnFormFile(fsResult);
                RepFileMinIO rfss = new RepFileMinIO(Config.ReadConfig("AppSettings:WebApiMinIO"), Config.ReadConfig("AppSettings:WebApiMinIO_clientId"), Config.ReadConfig("AppSettings:WebApiMinIO_clientSecret"));
                fs.Dispose();
                System.IO.Directory.Delete(strTargetDirectory, true);//Xoá thư mục đã giải nén.
                return strPathQSB = rfss.upload(ifi, rootMinIO, "image", true, null, uuid);  //get link from minIO;
            }
            else
            {


                string strPathQSB = "";
                FileStream fs = new FileStream(pathname, FileMode.OpenOrCreate);
                var fsResult = new FileStreamResult(fs, MediaTypeNames.Image.Jpeg);
                IFormFile ifi = ReturnFormFile(fsResult);
                RepFileMinIO rfss = new RepFileMinIO(Config.ReadConfig("AppSettings:WebApiMinIO"), Config.ReadConfig("AppSettings:WebApiMinIO_clientId"), Config.ReadConfig("AppSettings:WebApiMinIO_clientSecret"));
                fs.Dispose();
                return strPathQSB = rfss.upload(ifi, rootMinIO, "image", true, null, uuid);  //get link from minIO;
            }
        }
        */

        public static string GetFileExtensionFromContentType(string contentType)
        {
            //string contentType = "audio/wav";
            if (string.IsNullOrEmpty(contentType))
                return "";
            try
            {
                return MimeTypeMap.GetExtension(contentType);
            }
            catch (Exception)
            {
                return "";
            }
        }

        public static string GetContentTypeFromFileExtension(string fileExtension)
        {
            //string fileExtension = ".wav";
            if (string.IsNullOrEmpty(fileExtension))
                return "";
            string contentType = "";
            try
            {
                var provider = new FileExtensionContentTypeProvider();
                if (!provider.TryGetContentType(fileExtension, out contentType))
                {
                }
            }
            catch (Exception)
            {
            }
            return contentType;
        }
    }
}