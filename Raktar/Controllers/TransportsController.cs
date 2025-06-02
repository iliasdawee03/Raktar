using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Raktar.Services;
using static Raktar.Dtos.TransportDto;

namespace Raktar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Authorize(Roles = "Carrier,Admin,WarehouseStaff")]
    public class TransportsController : ControllerBase
    {
        private readonly ITransportService _transportService;

        public TransportsController(ITransportService transportService)
        {
            _transportService = transportService;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransportReadDto>>> GetAll()
        {
            var transports = await _transportService.GetAllAsync();
            return Ok(transports);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<TransportReadDto>> GetById(int id)
        {
            var transport = await _transportService.GetByIdAsync(id);
            return transport == null ? NotFound() : Ok(transport);
        }


        [HttpPost]
        public async Task<ActionResult<TransportCreateDto>> Create(TransportCreateDto dto)
        {
            var createdTransport = await _transportService.CreateAsync(dto);
            return Ok(dto);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody]TransportUpdateDto dto)
        {
            var result = await _transportService.UpdateStatusAsync(id, dto.Status, dto.EndDate);
            return result ? NoContent() : NotFound();
        }
    }
}
