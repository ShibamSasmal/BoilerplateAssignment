using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace Ass.EntityFrameworkCore
{
    public static class AssDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<AssDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<AssDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}
