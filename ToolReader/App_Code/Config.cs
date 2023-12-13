using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.IO;

namespace WebApi.App_Code
{
    public class Config
    {
        public Config()
        {
        }

        public static string ReadConfig(string strKey, string strDefaultValue = "")
        {   // strKey co dang: "AppSettings:logDir"

            if (string.IsNullOrEmpty(strKey))
                return strDefaultValue;

            try
            {
                var config = new ConfigurationBuilder()
                                .SetBasePath(Directory.GetCurrentDirectory())
                                .AddJsonFile("appsettings.json").Build();
                if (config != null)
                {
                    //string strLogDir = config.GetSection("AppSettings").GetValue<string>(strKey);
                    return config[strKey];
                }
                return strDefaultValue;
            }
            catch (Exception) { }
            return strDefaultValue;
        }

        public static bool ReadAppSettingsBool(string strKey, bool bDefaultValue = false)
        {
            try
            {
                string strDefaultValue = "";
                string strValue = ReadConfig("AppSettings:"+strKey, strDefaultValue);
                if (string.IsNullOrEmpty(strValue))
                    return bDefaultValue;

                strValue = strValue.Trim().ToLower();
                return strValue == "true" || strValue == "1" || strValue == "yes" ? true : false;
            }
            catch (Exception) { }
            return bDefaultValue;
        }

        public static int ReadAppSettingsInt(string strKey, int iDefaultValue = 0)
        {
            try
            {
                string strDefaultValue = "";
                string strValue = ReadConfig("AppSettings:" + strKey, strDefaultValue);
                if (string.IsNullOrEmpty(strValue))
                    return iDefaultValue;

                strValue = strValue.Trim();
                return int.Parse(strValue);
            }
            catch (Exception) { }
            return iDefaultValue;
        }

        public static string ReadAppSettingsString(string strKey, string strDefaultValue = "")
        {
            try
            {
                string strDefVal = "";
                string strValue = ReadConfig("AppSettings:" + strKey, strDefVal);
                if (string.IsNullOrEmpty(strValue))
                    return strDefaultValue;

                return strValue.Trim();
            }
            catch (Exception) { }
            return strDefaultValue;
        }
    }
}
