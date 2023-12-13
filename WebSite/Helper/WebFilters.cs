using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net.Http;
using WebAdmin.Helper;

namespace WebAdmin.Helper
{
    public class AuthenticateFilter : Attribute, IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            // do something before the action executes
            long? UserID = context.HttpContext.GetUserID();
            if (UserID==null || UserID <= 0)
            {
                bool IsAjaxRequest = context.HttpContext.Request.Headers["x-requested-with"] == "XMLHttpRequest" ? true : false;
                if (IsAjaxRequest)
                {
                    context.Result = new ContentResult()
                    {
                        Content = null,
                        StatusCode = (int)System.Net.HttpStatusCode.Unauthorized
                    };
                }
                else
                {
                    //context.Result = new RedirectResult("/Account/SignIn");
                    string returnurl = Microsoft.AspNetCore.Http.Extensions.UriHelper.GetEncodedUrl(context.HttpContext.Request);
                    context.Result = new RedirectToRouteResult(
                                        new RouteValueDictionary{
                                            {"controller", "Account"},
                                            {"action", "Login"},
                                            {"Area","" },
                                            {"returnurl",returnurl }
                                        });
                }
            }
            else
            {
               
                var role = context.HttpContext.GetUserRole();
                if (role == 1302)
                {
                    context.Result = new RedirectToRouteResult(
                                       new RouteValueDictionary{
                                            {"controller", "Account"},
                                            {"action", "Login"},
                                            {"Area","" }
                                       });
                }
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // do something after the action executes
        }

        /*ActionFilterAttribute*/
        //Execute 1
        //public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        //{
        //    Int64 UserID = context.HttpContext.GetUserID();
        //    if (UserID <= 0)
        //    {
        //        bool IsAjaxRequest = context.HttpContext.Request.Headers["x-requested-with"] == "XMLHttpRequest" ? true : false;
        //        if (IsAjaxRequest)
        //        {
        //            context.Result = new ContentResult()
        //            { 
        //                Content = null,
        //                StatusCode = 403
        //            };
        //        }
        //        else
        //        {
        //            //context.Result = new RedirectResult("/Account/SignIn");
        //            context.Result = new RedirectResult("/Home/Index");
        //        }
        //    }

        //    await base.OnActionExecutionAsync(context, next);
        //}
        //Execute 2
        //public override void OnActionExecuting(ActionExecutingContext context)
        //{
        //    // do something before the action executes
        //    base.OnActionExecuting(context);
        //}
        //Execute 3 not work
        //public override void OnActionExecuted(ActionExecutedContext context)
        //{
        //    // do something after the action executes

        //    base.OnActionExecuted(context);
        //}
        //Execute 4
        //public override async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
        //{
        //    await base.OnResultExecutionAsync(context, next);
        //}
        //Execute 5
        //public override void OnResultExecuting(ResultExecutingContext context)
        //{
        //    base.OnResultExecuting(context);
        //}
        // Execute 6
        //public override void OnResultExecuted(ResultExecutedContext context)
        //{
        //    base.OnResultExecuted(context);
        //}
    }
    
}
