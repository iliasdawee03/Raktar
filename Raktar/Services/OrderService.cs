using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Raktar.Entity;
using static Raktar.Dtos.OrderDto;

namespace Raktar.Services
{

    public interface IOrderService
    {
        Task<List<OrderReadDto>> GetAllOrdersAsync();
        Task<OrderReadDto?> GetOrderByIdAsync(int id);
        Task<OrderReadDto> CreateOrderAsync(OrderCreateDto dto);
        Task<bool> UpdateOrderAsync(int id, OrderUpdateDto dto);
        Task<bool> DeleteOrderAsync(int id);
    }

    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public OrderService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<OrderReadDto>> GetAllOrdersAsync()
        {
            var orders = await _context.Orders
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                .ToListAsync();

            return _mapper.Map<List<OrderReadDto>>(orders);
        }

        public async Task<OrderReadDto?> GetOrderByIdAsync(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            return order == null ? null : _mapper.Map<OrderReadDto>(order);
        }

        public async Task<OrderReadDto> CreateOrderAsync(OrderCreateDto dto)
        {
            var order = _mapper.Map<Order>(dto);
            order.PlacedAt = DateTime.UtcNow;
            order.ClosedAt = DateTime.UtcNow.AddHours(24);
            order.Status = "Pending";

            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            return _mapper.Map<OrderReadDto>(order);
        }

            public async Task<bool> UpdateOrderAsync(int id, OrderUpdateDto dto)
            {
                var existingOrder = await _context.Orders
                    .Include(o => o.Items)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (existingOrder == null) { return false; }

                _context.OrderItems.RemoveRange(existingOrder.Items);

                var updatedItems = _mapper.Map<List<OrderItem>>(dto.Items);
                existingOrder.Items = updatedItems;

                await _context.SaveChangesAsync();
                return true;
            }

        public async Task<bool> DeleteOrderAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return false;

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
