using Abp.Application.Services;
using Abp.UI;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Files
{
    public class FileAppService : ApplicationService, IFileAppService
    {
        private readonly string[] _validImageTypes = { "image/jpeg", "image/png", "image/gif", "image/bmp" };

        public async Task<string> UploadImage(IFormFile file)
        {
            // Check if file is null or empty
            if (file == null || file.Length == 0)
            {
                throw new UserFriendlyException("No file uploaded.");
            }

            // Validate file type
            if (!_validImageTypes.Contains(file.ContentType))
            {
                throw new UserFriendlyException("Invalid file type. Please upload an image file.");
            }

           
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

            // Create the directory if it doesn't exist
            try
            {
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Could not create upload directory.", ex);
            }

            // Generate a unique file name
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadPath, fileName);

            // Save the file to the directory
            try
            {
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Could not save the file.", ex);
            }

            // Return the relative path of the saved image
            return $"/images/{fileName}";
        }
    }
}
