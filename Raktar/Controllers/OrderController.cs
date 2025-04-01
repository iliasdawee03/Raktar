using Microsoft.AspNetCore.Mvc;
using Raktar.Dtos;
using Raktar.Services;
using System.Threading.Tasks;

namespace Raktar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound("Nincs ilyen rendelés!");
            }
            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDto orderDto)
        {
            if (orderDto == null)
            {
                return BadRequest("Adatok megadása szükséges!");
            }

            var newOrder = await _orderService.CreateOrderAsync(orderDto);
            return CreatedAtAction(nameof(GetOrderById), new { id = newOrder.Id }, newOrder);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] OrderDto orderDto)
        {
            if (orderDto == null)
            {
                return BadRequest("Adatok megadása szükséges!");
            }

            var result = await _orderService.UpdateOrderAsync(id, orderDto);
            if (!result)
            {
                return NotFound("Nincs ilyen rendelés!");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var result = await _orderService.DeleteOrderAsync(id);
            if (!result)
            {
                return NotFound("Nincs ilyen rendelés!");
            }

            return NoContent();
        }
    }
}
