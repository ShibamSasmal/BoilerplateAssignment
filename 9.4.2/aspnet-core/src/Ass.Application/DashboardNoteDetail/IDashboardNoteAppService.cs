using Abp.Application.Services;
using Ass.DashboardNoteDetail.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.DashboardNoteDetail
{
    public interface IDashboardNoteAppService : IApplicationService
    {
        Task CreateAsync(CreateDashboardNoteDetailDto input);
        Task<List<Entities.DashboardNoteDetail>> GetNotesByUserIdAsync(long userId);
    }
}
