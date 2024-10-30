using Abp.Application.Services;
using Abp.Domain.Repositories;
using Ass.DashboardNoteDetail.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.DashboardNoteDetail
{
    public class DashboardNoteAppService : ApplicationService, IDashboardNoteAppService
    {
        private readonly IRepository<Ass.Entities.DashboardNoteDetail, int> _dashboardNoteRepository;

        public DashboardNoteAppService(IRepository<Ass.Entities.DashboardNoteDetail, int> dashboardNoteRepository)
        {
            _dashboardNoteRepository = dashboardNoteRepository;
        }

        public async Task CreateAsync(CreateDashboardNoteDetailDto input)
        {
            var noteDetail = new Ass.Entities.DashboardNoteDetail
            {
                UserId = input.UserId,
                HtmlContent = input.HtmlContent
            };

            await _dashboardNoteRepository.InsertAsync(noteDetail);
        }

        public async Task<List<Entities.DashboardNoteDetail>> GetNotesByUserIdAsync(long userId)
        {
            return await _dashboardNoteRepository.GetAll()
                .Where(note => note.UserId == userId)
                .ToListAsync();
        }
    }
}
