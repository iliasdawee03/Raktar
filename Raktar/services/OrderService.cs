using Microsoft.EntityFrameworkCore;
using Raktar.Entity;
using Raktar.Dtos;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Raktar.Services
{
    public interface IOrderService
    {
        Task<List<OrderDto>> GetAllOrdersAsync();
        Task<OrderDto?> GetOrderByIdAsync(int id);
        Task<OrderDto> CreateOrderAsync(OrderDto orderDto);
        Task<bool> UpdateOrderAsync(int id, OrderDto orderDto);
        Task<bool> DeleteOrderAsync(int id);
    }

    public class OrderService : IOrderService
    {
        private readonly RaktarDbContext _context;

        public OrderService(RaktarDbContext context)
        {
            _context = context;
        }

    }
}
