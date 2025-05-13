using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Raktar.Migrations
{
    /// <inheritdoc />
    public partial class CarrierAddedToOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CarrierId",
                table: "Orders",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CarrierId",
                table: "Orders");
        }
    }
}
