using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ass.Migrations
{
    /// <inheritdoc />
    public partial class Mmodify_Link_Entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LinkCountryMappings_Countries_CountryId",
                table: "LinkCountryMappings");

            migrationBuilder.DropForeignKey(
                name: "FK_LinkCountryMappings_Links_LinkId",
                table: "LinkCountryMappings");

            migrationBuilder.DropIndex(
                name: "IX_LinkCountryMappings_CountryId",
                table: "LinkCountryMappings");

            migrationBuilder.DropIndex(
                name: "IX_LinkCountryMappings_LinkId",
                table: "LinkCountryMappings");

            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "Links",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CountryName",
                table: "Countries",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CountryCode",
                table: "Countries",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Links_CountryId",
                table: "Links",
                column: "CountryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Links_Countries_CountryId",
                table: "Links",
                column: "CountryId",
                principalTable: "Countries",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Links_Countries_CountryId",
                table: "Links");

            migrationBuilder.DropIndex(
                name: "IX_Links_CountryId",
                table: "Links");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "Links");

            migrationBuilder.AlterColumn<string>(
                name: "CountryName",
                table: "Countries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CountryCode",
                table: "Countries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_LinkCountryMappings_CountryId",
                table: "LinkCountryMappings",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_LinkCountryMappings_LinkId",
                table: "LinkCountryMappings",
                column: "LinkId");

            migrationBuilder.AddForeignKey(
                name: "FK_LinkCountryMappings_Countries_CountryId",
                table: "LinkCountryMappings",
                column: "CountryId",
                principalTable: "Countries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LinkCountryMappings_Links_LinkId",
                table: "LinkCountryMappings",
                column: "LinkId",
                principalTable: "Links",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
