using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Raktar.Services;
using static Raktar.Dtos.DeliveryFormDto;

namespace Raktar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Authorize(Roles = "Supplier")]
    public class DeliveryFormsController : ControllerBase
    {
        private readonly IDeliveryFormService _deliveryFormService;

        public DeliveryFormsController(IDeliveryFormService deliveryFormService)
        {
            _deliveryFormService = deliveryFormService;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeliveryFormReadDto>>> GetAll()
        {
            var forms = await _deliveryFormService.GetAllAsync();
            return Ok(forms);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<DeliveryFormReadDto>> GetById(int id)
        {
            var form = await _deliveryFormService.GetByIdAsync(id);
            return form == null ? NotFound() : Ok(form);
        }

        [HttpPost]
        public async Task<ActionResult<DeliveryFormReadDto>> Create(DeliveryFormCreateDto dto)
        {
            var createdForm = await _deliveryFormService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdForm.Id }, createdForm);
        }
    }
}
