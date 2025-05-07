using Microsoft.AspNetCore.Mvc;
using Raktar.Services;
using Raktar.Dtos;
using static Raktar.Dtos.ComplaintDto;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace Raktar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Authorize(Roles = "Customer,Admin")]
    public class ComplaintsController : ControllerBase
    {
        private readonly IComplaintService _complaintService;

        public ComplaintsController(IComplaintService complaintService)
        {
            _complaintService = complaintService;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<ComplaintReadDto>>> GetAll()
        {
            var complaints = await _complaintService.GetAllAsync();
            return Ok(complaints);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<ComplaintReadDto>> GetById(int id)
        {
            var complaint = await _complaintService.GetByIdAsync(id);
            return complaint == null ? NotFound() : Ok(complaint);
        }

        [HttpPost]
        public async Task<ActionResult<ComplaintReadDto>> Create(ComplaintCreateDto dto)
        {
            var createdComplaint = await _complaintService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdComplaint.Id }, createdComplaint);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _complaintService.DeleteAsync(id);
            return result ? NoContent() : NotFound();
        }
    }
}
