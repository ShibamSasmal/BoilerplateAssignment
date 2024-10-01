using Abp.Application.Services.Dto;
using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ass.Categories.Dto;

namespace Ass.Categories
{
    public interface ICategoryAppService : IAsyncCrudAppService<CategoryDto, int, PagedAndSortedResultRequestDto, CreateCategoryDto, CategoryDto>
    {
    }
}
