using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace SSP_WebAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            config.EnableCors();

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Routes.IgnoreRoute("ignore", "{resource}.ashx/{*pathInfo}");

            //GlobalConfiguration.Configuration.Formatters.JsonFormatter.S‌​erializerSettings.Da‌​teFormatString = "MM/dd/yyyy";
        }
    }
}
