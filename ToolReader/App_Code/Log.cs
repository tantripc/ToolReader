using Newtonsoft.Json;
using System.Text;

namespace WebApi.App_Code
{
    public class Log
    {
        //private readonly IConfiguration _config;

        //public Log(IConfiguration config)
        public Log()
        {
            //_config = config;
        }

        /*
        public void Write(string strLog)
        {
            // For Log error/exception
            try
            {
                if (_config == null)
                    return;

                //string strLogDir = ConfigReader.ReadString("logDir");
                string strLogDir = _config.GetSection("AppSettings").GetValue<string>("logDir");
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
            catch (Exception) { }
        }

        public void WriteThreadLog(string strLog)
        {
            // For Thread log
            try
            {
                if (_config == null)
                    return;

                //string strLogDir = ConfigReader.ReadString("logDir");
                string strLogDir = _config.GetSection("AppSettings").GetValue<string>("logDir");
                if (string.IsNullOrEmpty(strLogDir) || string.IsNullOrEmpty(strLog))
                    return;

                strLogDir = strLogDir.TrimEnd("\\".ToCharArray());
                strLogDir += "\\";
                Directory.CreateDirectory(strLogDir);

                string strLogFile = strLogDir + DateTime.Now.ToString("yyyy-MM-dd") + "_Thrd.log";
                string strCurDateTime = "[" + DateTime.Now.ToString("dd-MM-yyyy hh:mm:ss tt") + "]\r\n";
                strLog += "\r\n\r\n";

                FileStream file = new FileStream(strLogFile, FileMode.OpenOrCreate, FileAccess.Write);
                file.Seek(file.Length, SeekOrigin.Begin);
                file.Write(Encoding.GetEncoding(65001).GetBytes(strCurDateTime), 0, Encoding.GetEncoding(65001).GetByteCount(strCurDateTime));
                file.Write(Encoding.GetEncoding(65001).GetBytes(strLog), 0, Encoding.GetEncoding(65001).GetByteCount(strLog));
                file.Close();
            }
            catch (Exception) { }
        }

        public void WriteFCMLogResult(string strLog)
        {
            try
            {
                if (_config == null)
                    return;

                //string strLogDir = ConfigReader.ReadString("logDir");
                string strLogDir = _config.GetSection("AppSettings").GetValue<string>("logDir");
                if (string.IsNullOrEmpty(strLogDir) || string.IsNullOrEmpty(strLog))
                    return;

                strLogDir = strLogDir.TrimEnd("\\".ToCharArray());
                strLogDir += "\\";
                Directory.CreateDirectory(strLogDir);

                string strLogFile = strLogDir + DateTime.Now.ToString("yyyy-MM-dd") + "_FCM.log";
                string strCurDateTime = "[" + DateTime.Now.ToString("dd-MM-yyyy hh:mm:ss tt") + "]\r\n";
                strLog += "\r\n\r\n";

                FileStream file = new FileStream(strLogFile, FileMode.OpenOrCreate, FileAccess.Write);
                file.Seek(file.Length, SeekOrigin.Begin);
                file.Write(Encoding.GetEncoding(65001).GetBytes(strCurDateTime), 0, Encoding.GetEncoding(65001).GetByteCount(strCurDateTime));
                file.Write(Encoding.GetEncoding(65001).GetBytes(strLog), 0, Encoding.GetEncoding(65001).GetByteCount(strLog));
                file.Close();
            }
            catch (Exception) { }
        }

        public void WriteString(string strLog)
        {
            // For log parameter
            try
            {
                //string strLogDir = ConfigReader.ReadString("logDir");
                string strLogDir = _config.GetSection("AppSettings").GetValue<string>("logDir");
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
            catch (Exception) { }
        }

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

        public void LogParam(string strRoute, object model_or_prs)
        {
            // Log param for debug
            try
            {
                if (_config.GetSection("AppSettings").GetValue<string>("IsLogParam").Trim().ToLower() == "true")
                {
                    string strLogFunctionName = _config.GetSection("AppSettings").GetValue<string>("LogFunctionName");
                    if (!string.IsNullOrEmpty(strLogFunctionName) && (strLogFunctionName == strRoute || strLogFunctionName == "*" || strLogFunctionName.IndexOf(";" + strRoute + ";") >= 0))
                    {
                        string strLog = model_or_prs == null ? "[parameter is null]" : JsonConvert.SerializeObject(model_or_prs);
                        //WriteString(strRoute + "\r\n" + strLog + "\r\n");
                        strLog = strRoute + "\r\n" + strLog + "\r\n";

                        try
                        {
                            if (model_or_prs != null)
                            {
                                string strParams = "";
                                if (model_or_prs.GetType() == typeof(Dictionary<string, object>))
                                {
                                    Dictionary<string, object> prs = (Dictionary<string, object>)model_or_prs;
                                    if (prs != null)
                                    {
                                        foreach (var item in prs)
                                        {
                                            strParams += (string.IsNullOrEmpty(strParams) ? "" : "&") + StrUtil.ReplaceInvalidFileNameChar(item.Key.ToString()) + "=" + (item.Value == null ? "" : StrUtil.ReplaceInvalidFileNameChar(item.Value.ToString()));
                                        }
                                    }
                                }
                                else
                                {
                                    System.Reflection.PropertyInfo[] prop = model_or_prs.GetType().GetProperties();
                                    foreach (var pr in prop)
                                    {
                                        string name = pr.Name;
                                        object value = pr.GetValue(model_or_prs, new object[] { });
                                        strParams += (string.IsNullOrEmpty(strParams) ? "" : "&") + StrUtil.ReplaceInvalidFileNameChar(name) + "=" + (value == null ? "" : StrUtil.ReplaceInvalidFileNameChar(value.ToString()));
                                    }
                                }

                                //if (prs != null)
                                //{
                                if (!string.IsNullOrEmpty(strParams))
                                {
                                    strLog = strLog + "------------------\r\n";
                                    strLog = strLog + strRoute + "?" + strParams + "\r\n";
                                }
                                //}
                            }
                        }
                        catch (Exception) { }

                        strLog += "\r\n";
                        WriteString(strLog);
                    }
                }
            }
            catch (Exception) { }
        }
        */



        public static void Write(string strLog)
        {
            // For Log error/exception
            try
            {
                //if (_config == null)
                //    return;

                string strLogDir = WebConfigs.AppSettings.logDir;
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
            catch (Exception) { }
        }

        public static void WriteThreadLog(string strLog)
        {
            // For Thread log
            try
            {
                //if (_config == null)
                //    return;

                string strLogDir = WebConfigs.AppSettings.logDir;
                if (string.IsNullOrEmpty(strLogDir) || string.IsNullOrEmpty(strLog))
                    return;

                strLogDir = strLogDir.TrimEnd("\\".ToCharArray());
                strLogDir += "\\";
                Directory.CreateDirectory(strLogDir);

                string strLogFile = strLogDir + DateTime.Now.ToString("yyyy-MM-dd") + "_Thrd.log";
                string strCurDateTime = "[" + DateTime.Now.ToString("dd-MM-yyyy hh:mm:ss tt") + "]\r\n";
                strLog += "\r\n\r\n";

                FileStream file = new FileStream(strLogFile, FileMode.OpenOrCreate, FileAccess.Write);
                file.Seek(file.Length, SeekOrigin.Begin);
                file.Write(Encoding.GetEncoding(65001).GetBytes(strCurDateTime), 0, Encoding.GetEncoding(65001).GetByteCount(strCurDateTime));
                file.Write(Encoding.GetEncoding(65001).GetBytes(strLog), 0, Encoding.GetEncoding(65001).GetByteCount(strLog));
                file.Close();
            }
            catch (Exception) { }
        }

        public static void WriteFCMLogResult(string strLog)
        {
            try
            {
                //if (_config == null)
                //    return;

                string strLogDir = WebConfigs.AppSettings.logDir;
                if (string.IsNullOrEmpty(strLogDir) || string.IsNullOrEmpty(strLog))
                    return;

                strLogDir = strLogDir.TrimEnd("\\".ToCharArray());
                strLogDir += "\\";
                Directory.CreateDirectory(strLogDir);

                string strLogFile = strLogDir + DateTime.Now.ToString("yyyy-MM-dd") + "_FCM.log";
                string strCurDateTime = "[" + DateTime.Now.ToString("dd-MM-yyyy hh:mm:ss tt") + "]\r\n";
                strLog += "\r\n\r\n";

                FileStream file = new FileStream(strLogFile, FileMode.OpenOrCreate, FileAccess.Write);
                file.Seek(file.Length, SeekOrigin.Begin);
                file.Write(Encoding.GetEncoding(65001).GetBytes(strCurDateTime), 0, Encoding.GetEncoding(65001).GetByteCount(strCurDateTime));
                file.Write(Encoding.GetEncoding(65001).GetBytes(strLog), 0, Encoding.GetEncoding(65001).GetByteCount(strLog));
                file.Close();
            }
            catch (Exception) { }
        }

        public static void WriteString(string strLog)
        {
            // For log parameter
            try
            {
                string strLogDir = WebConfigs.AppSettings.logDir;
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
            catch (Exception) { }
        }

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

        public static void LogParam(string strRoute, object model_or_prs)
        {
            // Log param for debug
            try
            {
                if (WebConfigs.AppSettings.IsLogParam.ToLower() == "true")
                {
                    string strLogFunctionName = WebConfigs.AppSettings.LogFunctionName;

                    if (!string.IsNullOrEmpty(strRoute))
                        strRoute = strRoute.TrimStart("/".ToCharArray());
                    if (!string.IsNullOrEmpty(strLogFunctionName))
                        strLogFunctionName = strLogFunctionName.Replace(";/", ";").TrimStart("/".ToCharArray());

                    //if (!string.IsNullOrEmpty(strLogFunctionName) && (strLogFunctionName == strRoute || strLogFunctionName == "*" || strLogFunctionName.IndexOf(";" + strRoute + ";") >= 0))
                    if (!string.IsNullOrEmpty(strLogFunctionName)
                        && (strLogFunctionName == "*" || string.Compare(strLogFunctionName, strRoute, true) == 0 || strLogFunctionName.IndexOf(";" + strRoute + ";", StringComparison.OrdinalIgnoreCase) >= 0))
                    {
                        string strLog = model_or_prs == null ? "[parameter is null]" : JsonConvert.SerializeObject(model_or_prs);
                        //WriteString(strRoute + "\r\n" + strLog + "\r\n");
                        strLog = strRoute + "\r\n" + strLog + "\r\n";

                        try
                        {
                            if (model_or_prs != null)
                            {
                                string strParams = "";
                                if (model_or_prs.GetType() == typeof(Dictionary<string, object>))
                                {
                                    Dictionary<string, object> prs = (Dictionary<string, object>)model_or_prs;
                                    if (prs != null)
                                    {
                                        foreach (var item in prs)
                                        {
                                            strParams += (string.IsNullOrEmpty(strParams) ? "" : "&") + StrUtil.ReplaceInvalidFileNameChar(item.Key.ToString()) + "=" + (item.Value == null ? "" : StrUtil.ReplaceInvalidFileNameChar(item.Value.ToString()));
                                        }
                                    }
                                }
                                else
                                {
                                    System.Reflection.PropertyInfo[] prop = model_or_prs.GetType().GetProperties();
                                    foreach (var pr in prop)
                                    {
                                        string name = pr.Name;
                                        object value = pr.GetValue(model_or_prs, new object[] { });
                                        strParams += (string.IsNullOrEmpty(strParams) ? "" : "&") + StrUtil.ReplaceInvalidFileNameChar(name) + "=" + (value == null ? "" : StrUtil.ReplaceInvalidFileNameChar(value.ToString()));
                                    }
                                }

                                //if (prs != null)
                                //{
                                if (!string.IsNullOrEmpty(strParams))
                                {
                                    strLog = strLog + "------------------\r\n";
                                    strLog = strLog + strRoute + "?" + strParams + "\r\n";
                                }
                                //}
                            }
                        }
                        catch (Exception) { }

                        strLog += "\r\n";
                        WriteString(strLog);
                    }
                }
            }
            catch (Exception) { }
        }
    }
}
