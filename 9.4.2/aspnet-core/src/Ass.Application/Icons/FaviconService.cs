using Abp.Application.Services;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Icons
{
    public class FaviconService : ApplicationService, IFaviconService
    {
        private readonly IWebHostEnvironment _env;
        private readonly HttpClient _httpClient;

        public FaviconService(IWebHostEnvironment env)
        {
            _env = env;
            _httpClient = new HttpClient();
        }
        public async Task<string> DownloadFaviconAsync(string url)
        {
            try
            {
                var uri = new Uri(url);
                var faviconUrl = $"https://www.google.com/s2/favicons?sz=64&domain={uri.Host}";
                var response = await _httpClient.GetAsync(faviconUrl);
                response.EnsureSuccessStatusCode();

                var filePath = Path.Combine(_env.ContentRootPath, "wwwroot", "images", $"{uri.Host}-favicon.png");

                using (var fs = new FileStream(filePath, FileMode.Create))
                {
                    await response.Content.CopyToAsync(fs);
                }

                return $"/images/{uri.Host}-favicon.png"; 
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to download favicon", ex);
            }
        }
    }
}
