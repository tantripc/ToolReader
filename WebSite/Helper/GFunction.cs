using System.Xml;

namespace WebAdmin.Helper
{
    public class GFunction
    {
        private readonly IHostEnvironment _env;

        public GFunction(IHostEnvironment env)
        {
            _env = env;
        }
        //public static string GetFullHttpFolder(string keyAppsetting)
        //{
        //    string strFormat = "{0}://{1}:{2}/";
        //    string urlFormat = "";
        //    string dataSubFolder = XMLReader.ReadStringAttr(keyAppsetting, "data-subfolder");
        //    string folder = XMLReader.ReadString(keyAppsetting);
        //    if (string.IsNullOrEmpty(dataSubFolder))
        //    {
        //        urlFormat = folder;
        //    }
        //    else
        //    {
        //        urlFormat = string.Format(strFormat, HttpContext.Current.Request.Url.Scheme.ToLower().Trim(), HttpContext.Current.Request.Url.Host.ToLower().Trim(), HttpContext.Current.Request.Url.Port) + dataSubFolder;
        //    }

        //    return urlFormat;
        //}
    }
}
