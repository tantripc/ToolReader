using ObjectDefine;
using RepositoriesAPI;
using WebAdmin.Models;
namespace WebAdmin.Helper
{
    public static class WebSessions
    {
        public static bool HasUserID(this HttpContext httpContext)
        {
            long? UserID = httpContext.GetUserID();

            if (UserID == null || UserID == 0)
            {
                return false;
            }

            return true;
        }
        public static long? GetUserID(this HttpContext httpContext)
        {
            long? UserID = null;
            try
            {
                if (string.IsNullOrEmpty(httpContext.Session.GetString("UserID")))
                {
                    UserID = null;
                }
                else
                {
                    UserID = long.Parse(httpContext.Session.GetString("UserID"));
                }

                if (UserID == null || UserID == 0)
                {
                    string TokenKey = httpContext.GetToken();

                    if (!string.IsNullOrEmpty(TokenKey))
                    {
                        string res = new RepUserToken(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret)
                            .Verify(TokenKey);
                        if (res != null)
                        {
                            ReturnSession token = Newtonsoft.Json.JsonConvert.DeserializeObject<ReturnSession>(res);
                            if (token != null && token.userid > 0)
                            {
                                UserID = token.userid;

                                //set session
                                httpContext.SetUserID(UserID);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return UserID;
            }

            return UserID;
        }
        public static void SetUserID(this HttpContext httpContext, long? UserID)
        {
            httpContext.Session.SetString("UserID", UserID.ToString());
        }
        //public static bool HasUserID(this HttpContext httpContext)
        //{
        //    if (httpContext.Session.GetString("UserID") == null)
        //    {
        //        return false;
        //    }
        //    return true;
        //}
        //public static Int64 GetUserID(this HttpContext httpContext)
        //{
        //    Int64 UserID = -1;
        //    if (!Int64.TryParse(httpContext.Session.GetString("UserID"), out UserID))
        //    {
        //        UserID = -1;
        //    }

        //    if (UserID <= 0)
        //    {
        //        string TokenKey = httpContext.GetToken();
        //        if (!string.IsNullOrWhiteSpace(TokenKey))
        //        {
        //            string res = new RepositoriesAPI.RepUserToken(WebConfigs.AppSettings.WebApiService).Get(TokenKey);
        //            if (res != null)
        //            {
        //                UserToken token = Newtonsoft.Json.JsonConvert.DeserializeObject<UserToken>(res);
        //                if (token != null && token.userid > 0)
        //                {
        //                    UserID = token.userid;
        //                    httpContext.SetUserID(UserID);
        //                }
        //            }
        //        }
        //    }

        //    return UserID;
        //}
        public static Int64 GetUserRole(this HttpContext httpContext)
        {
            Int64 Role = -1;
            if (!Int64.TryParse(httpContext.Session.GetString("UserRole"), out Role))
            {
                Role = -1;
            }

            if (Role <= 0)
            {
                long? UserID = GetUserID(httpContext);
                string TokenKey = httpContext.GetToken();
                string res = new RepositoriesAPI.RepUser(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret).getdetailaccount(UserID,null);
                if (res != null)
                {
                    users users = Newtonsoft.Json.JsonConvert.DeserializeObject<users>(res);
                    if (users != null && users.v_role > 0)
                    {
                        Role = (long)users.v_role;
                        httpContext.SetUserRole(Role);
                    }
                }
            }

            return Role;
        }
        public static Int64 GetUserOrgID(this HttpContext httpContext)
        {
            Int64 OrgID = -1;
            if (!Int64.TryParse(httpContext.Session.GetString("UserOrgID"), out OrgID))
            {
                OrgID = -1;
            }

            if (OrgID <= 0)
            {
                long? UserID = GetUserID(httpContext);
                string TokenKey = httpContext.GetToken();
                string res = new RepositoriesAPI.RepUser(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret).getdetailaccount(UserID, null);
                if (res != null)
                {
                    users users = Newtonsoft.Json.JsonConvert.DeserializeObject<users>(res);
                    if (users != null && users.v_role > 0 && users.orgid!=null)
                    {
                        OrgID = (long)users.orgid;
                        httpContext.SetUserOrgID(OrgID);
                    }
                }
            }

            return OrgID;
        }
        private static long GetUserID()
        {
            throw new NotImplementedException();
        }

        //public static void SetUserID(this HttpContext httpContext, Int64 UserID)
        //{
        //    httpContext.Session.SetString("UserID", UserID.ToString());
        //}
        public static void SetUserRole(this HttpContext httpContext, Int64 v_role)
        {
            httpContext.Session.SetString("UserRole", v_role.ToString());
        }
        public static void SetUserOrgID(this HttpContext httpContext, Int64 OrgID)
        {
            httpContext.Session.SetString("UserOrgID", OrgID.ToString());
        }
    }
}
