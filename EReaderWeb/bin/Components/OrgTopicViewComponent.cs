using EReaderWeb.Helper;
using EReaderWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;

namespace EReaderWeb.Components
{
    public class OrgTopicViewComponent : ViewComponent
    {
        rep_topic rep_topic = new rep_topic(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        RepOrg repOrg = new RepOrg(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public async Task<IViewComponentResult> InvokeAsync()
        {
            string org = repOrg.get(new organization
            {
                posstart = 1,
                numofrow = -1,
                recursive = false,
                porgid = -1,
                iseffect = true
            });
            List<organization> data_org = new List<organization>();
            if (!string.IsNullOrEmpty(org))
            {
                data_org = JsonConvert.DeserializeObject<List<organization>>(org);
            }
            List<org_topic> lst_org_topic = new List<org_topic>();
            if (data_org != null)
            {
                for (int i = 0; i < data_org.Count; i++)
                {
                    org_topic org_topic = new org_topic
                    {
                        orgid = data_org[i].orgid,
                        orgname = data_org[i].orgname
                    };

                    //lấy data
                    long? getby = HttpContext.GetUserID();
                    //danh sách topic            
                    string res_topic = rep_topic.get(new topic
                    {
                        numofrow = 16,
                        posstart = 1,
                        iseffect = true,
                        recursive = true,
                        ptopicid = -1,
                        getby = getby,
                        orgid = data_org[i].orgid,
                    }, false);
                    List<topic> list_topic = new List<topic>();
                    if (!string.IsNullOrEmpty(res_topic))
                    {
                        list_topic = JsonConvert.DeserializeObject<List<topic>>(res_topic);
                    }
                    if (list_topic != null)
                    {
                        org_topic.topic_data = list_topic;
                    }
                    //
                    lst_org_topic.Add(org_topic);
                }
            }
            return View("~/Views/Common/OrgTopic.cshtml", lst_org_topic);
        }
    }
}
