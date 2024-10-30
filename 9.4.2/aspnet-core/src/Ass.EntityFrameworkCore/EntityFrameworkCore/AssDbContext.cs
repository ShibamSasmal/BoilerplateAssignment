using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using Ass.Authorization.Roles;
using Ass.Authorization.Users;
using Ass.MultiTenancy;
using Ass.Entities;
using Ass.LocatonEntities;

namespace Ass.EntityFrameworkCore
{
    public class AssDbContext : AbpZeroDbContext<Tenant, Role, User, AssDbContext>
    {
        /* Define a DbSet for each entity of the application */
        public DbSet<Country> Countries { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Link> Links { get; set; }
        public DbSet<LinkCountryMapping> LinkCountryMappings { get; set; }
        public DbSet<UserAndLinkMapping> userAndLinkMappings { get; set; }
        public DbSet<UserCountryMapping> userCountryMappings { get; set; }


        //Location Db Context
        public DbSet<Countries> Countriess { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<DashboardNoteDetail> dashboardNoteDetails { get; set; }
        public AssDbContext(DbContextOptions<AssDbContext> options)
            : base(options)
        {
        }
    }
}
