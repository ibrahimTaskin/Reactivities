using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next; // Requestleri işler, control eder.
        private readonly ILogger<ExceptionMiddleware> _logger; // loglama
        private readonly IHostEnvironment _env; // Host bilgisi verir.
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _env = env;
            _logger = logger;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context) // Http requestleri tutar
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,ex.Message);
               context.Response.ContentType="application/json"; // content type geçtik.
               context.Response.StatusCode= (int)HttpStatusCode.InternalServerError; // status kodunu geçtik.
               
               var response=_env.IsDevelopment() // Geliştirme aşamasında mı?
                        ? new AppException(context.Response.StatusCode,ex.Message,ex.StackTrace?.ToString())    // Geliştirme aşamasındaysa StackTrace Hatasını göster.
                        : new AppException(context.Response.StatusCode,"Server Error");                         // Geliştirme aşamasında değilse Server Error ver

                var options=new JsonSerializerOptions{ // Araştır ???
                    PropertyNamingPolicy=JsonNamingPolicy.CamelCase
                };

                var json=JsonSerializer.Serialize(response,options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}