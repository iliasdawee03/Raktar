using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Raktar.Services;
using static Raktar.Dtos.OrderDto;

namespace Raktar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Customer,Admin,Supplier, WarehouseStaff")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderReadDto>>> GetAll()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderReadDto>> GetById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            return order == null ? NotFound() : Ok(order);
        }

        [HttpPost]
        public async Task<ActionResult<OrderCreateDto>> Create(OrderCreateDto dto)
        {
            var order = await _orderService.CreateOrderAsync(dto);
            return Ok(dto);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> Update(int id, OrderUpdateDto dto)
        {
            var result = await _orderService.UpdateOrderAsync(id, dto);
            return result ? NoContent() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _orderService.DeleteOrderAsync(id);
            return result ? NoContent() : NotFound();
        }
    }
}
