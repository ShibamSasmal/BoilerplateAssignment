using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ass.Migrations
{
    /// <inheritdoc />
    public partial class addfieldinLink : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "userAndLinkMappings",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "userAndLinkMappings");
        }
    }
}
