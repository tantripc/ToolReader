using Microsoft.AspNetCore.Mvc;
using ReadFileOnline.Models;
using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;

namespace ReadFileOnline.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public FileContentResult Index(string p, string z, string id, string docid, string sig)
        {
            byte[] result = new Byte[64];
            string ContentType = "image/jpeg";
            string root_path = WebConfigs.AppSettings.ResourcePath;

            if (!string.IsNullOrEmpty(id) && !string.IsNullOrEmpty(sig))
            {
                string[] sigVals = Decrypt(sig, true, id + "+rEADer+").Split(new string[] { "$@$" }, StringSplitOptions.None);

                if (sigVals != null && sigVals.Length == 3)
                {
                    if (int.Parse("0" + sigVals[1]) != 1 || !sigVals[2].Equals("-1"))
                    {
                        sigVals[2] = sigVals[2] + ",";
                        if (sigVals[2].IndexOf(p + ",") == -1)
                        {
                            return File(result, ContentType);
                        }
                    }

                    if (string.IsNullOrEmpty(z)) z = "5";
                    if (!string.IsNullOrEmpty(p))
                    {
                        p = "p" + p.ToLower().Replace("p", "").PadLeft(6, '0');

                        string fileName = p + "_" + (z == "0" ? "0" : "7") + ".jpg";
                        string strPath = root_path + docid + "\\" + id + "\\" + fileName;

                        var stream = new FileStream(strPath, FileMode.Open);
                        using (var sr = new StreamReader(stream))
                        {
                            using (MemoryStream ms = new MemoryStream())
                            {
                                sr.BaseStream.CopyTo(ms);
                                result = ms.ToArray();
                            }
                        }
                        return File(result, ContentType);
                    }
                    else
                    {
                        return File(result, ContentType);
                    }
                }
                else
                {
                    return File(result, ContentType);
                }
            }
            return File(result, ContentType);
        }
        public FileContentResult Viewer(string p, string z, string id, string docid, string sig)
        {
            byte[] result = new Byte[64];
            string ContentType = "application/sureboard";
            string root_path = WebConfigs.AppSettings.ResourceEncodePath;

            if (!string.IsNullOrEmpty(id) && !string.IsNullOrEmpty(sig))
            {
                string[] sigVals = Decrypt(sig, true, id + "+rEADer+").Split(new string[] { "$@$" }, StringSplitOptions.None);

                if (sigVals != null && sigVals.Length == 3)
                {
                    if (int.Parse("0" + sigVals[1]) != 1 || !sigVals[2].Equals("-1"))
                    {
                        sigVals[2] = sigVals[2] + ",";
                        if (sigVals[2].IndexOf(p + ",") == -1)
                        {
                            return File(result, ContentType);
                        }
                    }
                    if (string.IsNullOrEmpty(z)) z = "5";
                    if (!string.IsNullOrEmpty(p))
                    {
                        p = "p" + p.ToLower().Replace("p", "").PadLeft(6, '0');

                        string fileName = p + "_" + (z == "0" ? "0" : "7") + ".lvm";
                        string strPath = root_path + docid + "\\" + id + "\\" + fileName;

                        var stream = new FileStream(strPath, FileMode.Open);
                        using (var sr = new StreamReader(stream))
                        {
                            using (MemoryStream ms = new MemoryStream())
                            {
                                sr.BaseStream.CopyTo(ms);
                                result = ms.ToArray();
                            }
                        }
                        return File(result, ContentType);
                    }
                    else
                    {
                        return File(result, ContentType);
                    }
                }
                else
                {
                    return File(result, ContentType);
                }
            }
            return File(result, ContentType);
        }

        public static string Encrypt(string toEncrypt, bool useHashing, string secure_secret)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(toEncrypt);
            byte[] key;
            if (useHashing)
            {
                MD5CryptoServiceProvider mD5CryptoServiceProvider = new MD5CryptoServiceProvider();
                key = mD5CryptoServiceProvider.ComputeHash(Encoding.UTF8.GetBytes(secure_secret));
                mD5CryptoServiceProvider.Clear();
            }
            else
            {
                key = Encoding.UTF8.GetBytes(secure_secret);
            }

            TripleDESCryptoServiceProvider tripleDESCryptoServiceProvider = new TripleDESCryptoServiceProvider();
            tripleDESCryptoServiceProvider.Key = key;
            tripleDESCryptoServiceProvider.Mode = CipherMode.ECB;
            tripleDESCryptoServiceProvider.Padding = PaddingMode.PKCS7;
            ICryptoTransform cryptoTransform = tripleDESCryptoServiceProvider.CreateEncryptor();
            byte[] array = cryptoTransform.TransformFinalBlock(bytes, 0, bytes.Length);
            tripleDESCryptoServiceProvider.Clear();
            return Convert.ToBase64String(array, 0, array.Length);
        }

        public static string Decrypt(string cipherString, bool useHashing, string secure_secret)
        {
            byte[] array = Convert.FromBase64String(cipherString);
            byte[] key;
            if (useHashing)
            {
                MD5CryptoServiceProvider mD5CryptoServiceProvider = new MD5CryptoServiceProvider();
                key = mD5CryptoServiceProvider.ComputeHash(Encoding.UTF8.GetBytes(secure_secret));
                mD5CryptoServiceProvider.Clear();
            }
            else
            {
                key = Encoding.UTF8.GetBytes(secure_secret);
            }

            TripleDESCryptoServiceProvider tripleDESCryptoServiceProvider = new TripleDESCryptoServiceProvider();
            tripleDESCryptoServiceProvider.Key = key;
            tripleDESCryptoServiceProvider.Mode = CipherMode.ECB;
            tripleDESCryptoServiceProvider.Padding = PaddingMode.PKCS7;
            ICryptoTransform cryptoTransform = tripleDESCryptoServiceProvider.CreateDecryptor();
            byte[] bytes = cryptoTransform.TransformFinalBlock(array, 0, array.Length);
            tripleDESCryptoServiceProvider.Clear();
            return Encoding.UTF8.GetString(bytes);
        }
    }
}