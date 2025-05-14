using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Raktar.Entity;
using Raktar.Services;
using static Raktar.Dtos.WarehouseStorageDto;

namespace Raktar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Authorize(Roles = "WarehouseStaff,Admin, Carrier")]
    public class WarehouseController : ControllerBase
    {
        private readonly IWarehouseService _warehouseService;

        public WarehouseController(IWarehouseService warehouseService)
        {
            _warehouseService = warehouseService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WarehouseStorageReadDto>>> GetAllStorage()
        {
            var storage = await _warehouseService.GetAllStorageAsync();
            return Ok(storage);
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignToStorage([FromBody] WarehouseStorageCreateDto dto)
        {
            var result = await _warehouseService.AssignToStorage(dto);
            return result ? NoContent() : BadRequest("Failed to assign product to storage.");
        }
    }
}
