using System.Resources;

namespace WebApi.App_Code
{
    public class ResourceReader
	{
        public ResourceReader()
		{
        }

        public static ResourceManager LoadResource(string baseName, string lang)
        {
            try
            {
                string v_sPath = System.AppDomain.CurrentDomain.BaseDirectory.ToString() + "Resources/";
                return ResourceManager.CreateFileBasedResourceManager(baseName + "." + lang, v_sPath, null);
            }
            catch (Exception) { }
            return null;
        }

        public static ResourceManager LoadResource(string baseName, string lang, string resourceFolder)
        {
            try
            {
                string v_sPath = System.AppDomain.CurrentDomain.BaseDirectory.ToString() + resourceFolder.TrimEnd("/".ToCharArray()) + "/";
                return ResourceManager.CreateFileBasedResourceManager(baseName + "." + lang, v_sPath, null);
            }
            catch (Exception) { }
            return null;
        }

        public static string GetGlobalResource(string lang, string key, string defaultValue="")
        {
            try
            {
                string v_sPath = WebConfigs.AppSettings.FolderResources;
//#if DEBUG
                //// .NetCore phai them doan nay
                //v_sPath = System.AppDomain.CurrentDomain.BaseDirectory.ToString().TrimEnd("\\".ToCharArray()).TrimEnd("/".ToCharArray());
                //v_sPath = System.IO.Directory.GetParent(v_sPath).ToString();
                //v_sPath = System.IO.Directory.GetParent(v_sPath).ToString();
                //v_sPath = System.IO.Directory.GetParent(v_sPath).ToString();
                //v_sPath = v_sPath + "/" + "Resources/";
                

                //#else
                //v_sPath = System.AppDomain.CurrentDomain.BaseDirectory.ToString() + "Resources/";
                //#endif //DEBUG
                ResourceManager v_ResMan = ResourceManager.CreateFileBasedResourceManager("Global." + lang, v_sPath, null);
                if (v_ResMan == null)
                    return defaultValue;
                string value = v_ResMan.GetString(key);
                return string.IsNullOrEmpty(value) ? defaultValue : value;
            }
            catch (Exception ex) { }
            return defaultValue;
        }

        public static string GetGlobalResource(string lang, string key, string resourceFolder, string defaultValue="")
        {
            try
            {
                string v_sPath = System.AppDomain.CurrentDomain.BaseDirectory.ToString() + resourceFolder.TrimEnd("/".ToCharArray()) + "/";
                ResourceManager v_ResMan = ResourceManager.CreateFileBasedResourceManager("Global." + lang, v_sPath, null);
                if (v_ResMan == null)
                    return defaultValue;
                return v_ResMan.GetString(key);
            }
            catch (Exception ex) { }
            return defaultValue;
        }

        public static string GetResource(string baseName, string lang, string key, string defaultValue="")
        {
            try
            {
                string v_sPath = System.AppDomain.CurrentDomain.BaseDirectory.ToString() + "Resources/";
                ResourceManager v_ResMan = ResourceManager.CreateFileBasedResourceManager(baseName + "." + lang, v_sPath, null);
                if (v_ResMan == null)
                    return defaultValue;
                return v_ResMan.GetString(key);
            }
            catch (Exception ex) { }
            return defaultValue;
        }

        public static string GetResource(string baseName, string lang, string key, string resourceFolder, string defaultValue="")
        {
            try
            {
                string v_sPath = System.AppDomain.CurrentDomain.BaseDirectory.ToString() + resourceFolder.TrimEnd("/".ToCharArray()) + "/";
                ResourceManager v_ResMan = ResourceManager.CreateFileBasedResourceManager(baseName + "." + lang, v_sPath, null);
                if (v_ResMan == null)
                    return defaultValue;
                return v_ResMan.GetString(key);
            }
            catch (Exception ex) { }
            return defaultValue;
        }
        /*
		public string GetGlobalResource(string lang,string key) 
		{
			string v_sPath = System.AppDomain.CurrentDomain.BaseDirectory.ToString() + "Resources/";   
			ResourceManager v_ResMan = ResourceManager.CreateFileBasedResourceManager("Global." + lang,v_sPath,null);
			string result = v_ResMan.GetString(key);

			return result;
		}

        public static string GetResource(string baseName ,string lang, string key){
            string v_sPath = System.AppDomain.CurrentDomain.BaseDirectory.ToString() + "Resources/";
            string dot=".";
            if (string.IsNullOrEmpty(lang)) dot = "";
            ResourceManager v_ResMan = ResourceManager.CreateFileBasedResourceManager(baseName + dot + lang, v_sPath, null);
            string result = v_ResMan.GetString(key);

            return result;
        }*/
        public static string ReadResource(string lang, string key)
        {
            lang = lang == null ? "vi" : (lang == "" ? "vi" : lang);
            return ResourceReader.GetGlobalResource(lang.ToLower() == "en" ? "en-US" : "vi-VN", key);
        }
    }
}
