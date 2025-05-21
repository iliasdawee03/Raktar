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
    [Authorize(Roles = "Supplier,Admin,WarehouseStaff")]
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
        public async Task<ActionResult<DeliveryFormCreateDto>> Create(DeliveryFormCreateDto dto)
        {
            var createdForm = await _deliveryFormService.CreateAsync(dto);
            return Ok(createdForm);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DeliveryFormUpdateDto>> Update(int id, DeliveryFormUpdateDto dto)
        {
            var updated = await _deliveryFormService.UpdateAsync(id, dto);
            if (updated == null)
                return NotFound();
            return Ok(updated);
        }
    }
}
