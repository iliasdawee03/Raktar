using Microsoft.AspNetCore.Mvc;
using Raktar.Services;
using static Raktar.Dtos.TransportDto;

namespace Raktar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        public async Task<ActionResult<TransportReadDto>> Create(TransportCreateDto dto)
        {
            var createdTransport = await _transportService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdTransport.Id }, createdTransport);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string newStatus)
        {
            var result = await _transportService.UpdateStatusAsync(id, newStatus);
            return result ? NoContent() : NotFound();
        }
    }
}
