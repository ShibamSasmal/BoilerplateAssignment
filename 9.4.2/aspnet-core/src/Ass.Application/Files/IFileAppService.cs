using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Files
{
    public interface IFileAppService
    {
        Task<string> UploadImage(IFormFile file);
    }
}
