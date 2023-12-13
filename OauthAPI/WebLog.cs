using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Newtonsoft.Json;

/*
try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(_rootUrlApi);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));

                //Add the Authorization header with the AccessToken.
                if (!string.IsNullOrEmpty(token))
                {
                    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                }
                var response = client.GetAsync(pathUrl).Result;

                client.Dispose();

                if (response != null && response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    new WebLog().Write(string.Format("APIGetConnect -> response: {0} -> {1}", response.StatusCode, response.RequestMessage.RequestUri.ToString()));
                }
            }
            catch (Exception ex)
            {
                new WebLog().Write(string.Format("APIGetConnect -> catch: {0}{1} -> {2}", _rootUrlApi, pathUrl, ex.Message));
            }
*/

namespace OauthAPI
{
    public class WebLog
    {
        private string _pathLog;

        public WebLog()
        {
            _pathLog = "./logs/apiconnector/";
        }

        public void Write(string strLog)
        {
            try
            {
                //string strLogDir = ConfigReader.ReadString("logDir");
                string strLogDir = _pathLog;
                if (string.IsNullOrEmpty(strLogDir) || string.IsNullOrEmpty(strLog))
                    return;

                strLogDir = strLogDir.TrimEnd("\\".ToCharArray());
                strLogDir += "\\";
                Directory.CreateDirectory(strLogDir);

                string strLogFile = strLogDir + DateTime.Now.ToString("yyyy-MM-dd") + ".log";
                string strCurDateTime = "[" + DateTime.Now.ToString("dd-MM-yyyy hh:mm:ss tt") + "]\r\n";
                strLog += "\r\n\r\n";

                FileStream file = new FileStream(strLogFile, FileMode.OpenOrCreate, FileAccess.Write);
                file.Seek(file.Length, SeekOrigin.Begin);
                file.Write(Encoding.GetEncoding(65001).GetBytes(strCurDateTime), 0, Encoding.GetEncoding(65001).GetByteCount(strCurDateTime));
                file.Write(Encoding.GetEncoding(65001).GetBytes(strLog), 0, Encoding.GetEncoding(65001).GetByteCount(strLog));
                file.Close();
            }
            catch (IOException) { }
        }

        public void WriteString(string strLog)
        {
            try
            {
                //string strLogDir = ConfigReader.ReadString("logDir");
                string strLogDir = _pathLog;
                if (string.IsNullOrEmpty(strLogDir) || string.IsNullOrEmpty(strLog))
                    return;
                strLogDir = strLogDir.TrimEnd("\\".ToCharArray());
                strLogDir += "\\";
                Directory.CreateDirectory(strLogDir);

                string strLogFile = strLogDir + DateTime.Now.ToString("yyyy-MM-dd") + "_Deb.log";
                string strCurDateTime = "[" + DateTime.Now.ToString("dd-MM-yyyy hh:mm:ss tt") + "]\r\n";
                strLog += "\r\n";

                FileStream file = new FileStream(strLogFile, FileMode.OpenOrCreate, FileAccess.Write);
                file.Seek(file.Length, SeekOrigin.Begin);
                file.Write(Encoding.GetEncoding(65001).GetBytes(strCurDateTime), 0, Encoding.GetEncoding(65001).GetByteCount(strCurDateTime));
                file.Write(Encoding.GetEncoding(65001).GetBytes(strLog), 0, Encoding.GetEncoding(65001).GetByteCount(strLog));
                file.Close();
            }
            catch (IOException) { }
        }

        /*public static void WriteORM(string strLog)
        {
            try
            {
                string strLogDir = ConfigReader.ReadString("logDir");
                if (string.IsNullOrEmpty(strLogDir) || string.IsNullOrEmpty(strLog))
                    return;
                strLogDir = strLogDir.TrimEnd("\\".ToCharArray());
                strLogDir += "\\";
                Directory.CreateDirectory(strLogDir);

                string strLogFile = strLogDir + DateTime.Now.ToString("yyyy-MM-dd") + "_ORM.log";
                string strCurDateTime = "[" + DateTime.Now.ToString("dd-MM-yyyy hh:mm:ss tt") + "]\r\n";
                strLog += "\r\n\r\n";

                FileStream file = new FileStream(strLogFile, FileMode.OpenOrCreate, FileAccess.Write);
                file.Seek(file.Length, SeekOrigin.Begin);
                file.Write(Encoding.GetEncoding(65001).GetBytes(strCurDateTime), 0, Encoding.GetEncoding(65001).GetByteCount(strCurDateTime));
                file.Write(Encoding.GetEncoding(65001).GetBytes(strLog), 0, Encoding.GetEncoding(65001).GetByteCount(strLog));
                file.Close();
            }
            catch (IOException) { }
        }*/

        public static string MakeParamString(object[] arrParams, object[] arrValues)
        {
            try
            {
                if (arrParams == null || arrValues == null)
                    return "";
                string strLog = "";
                for (int i = 0; i < arrParams.Length; i++)
                {
                    strLog += (arrParams[i] == null ? "[null]" : arrParams[i].ToString()) + "='" + (arrValues[i] == null ? "null" : arrValues[i].ToString()) + "', ";
                }
                strLog = strLog.TrimEnd(", ".ToCharArray());
                return strLog;
            }
            catch (Exception)
            {
                //Log.Write("Log.MakeParamString() exception. Error message:\r\n" + ex.Message);
            }
            return "";
        }

        /*
        public void LogParam(string strRoute, params string[] arrParams)
        {
            //////////////////////////////////////////////////
            // Log param for debug
            try
            {
                //if (config["AppSettings:IsLogParam"].Trim().ToLower() == "true")
                if (_config.GetSection("AppSettings").GetValue<string>("IsLogParam").Trim().ToLower() == "true")
                {
                    //string strLogFunctionName = config["AppSettings:LogFunctionName"];
                    string strLogFunctionName = _config.GetSection("AppSettings").GetValue<string>("LogFunctionName");
                    if (!string.IsNullOrEmpty(strLogFunctionName) && (strLogFunctionName == strRoute || strLogFunctionName == "*" || strLogFunctionName.IndexOf(";" + strRoute + ";") >= 0))
                    {
                        //WriteString(strRoute + ", XmlParam='" + "" + "'");
                        string strLog = "";
                        for (int p = 0; p < arrParams.Length; p++)
                            strLog += string.Format("#{0}='{1}'\r\n", p+1, arrParams[p]);
                        WriteString(strRoute + "\r\n" + strLog);
                    }
                }
            }
            catch (Exception) { }
            //////////////////////////////////////////////////
        }
        */


        //public void LogParam1(string strRoute, object obj, Dictionary<string, object> prs = null)
        //{
        //    if (obj != null)
        //    {
        //        string js = JsonConvert.SerializeObject(obj);
        //        Console.WriteLine(js);
        //    }
        //}


        //public void LogParam(string strRoute, generalmodels obj, Dictionary<string,object> prs = null)
        //{
        //    // Log param for debug
        //    try
        //    {
        //        if (_config.GetSection("AppSettings").GetValue<string>("IsLogParam").Trim().ToLower() == "true")
        //        {
        //            string strLogFunctionName = _config.GetSection("AppSettings").GetValue<string>("LogFunctionName");
        //            if (!string.IsNullOrEmpty(strLogFunctionName) && (strLogFunctionName == strRoute || strLogFunctionName == "*" || strLogFunctionName.IndexOf(";" + strRoute + ";") >= 0))
        //            {
        //                //string strLog = obj == null ? "[parameter is null]" : obj.ToJson();
        //                string strLog = "";
        //                if (obj == null && prs == null)
        //                    strLog = "[parameter is null]";
        //                else if (obj != null)
        //                    strLog = obj.ToJson();
        //                else
        //                    strLog = JsonConvert.SerializeObject(prs);
        //                WriteString(strRoute + "\r\n" + strLog + "\r\n");
        //            }
        //        }
        //    }
        //    catch (Exception) { }
        //}
    }
}
