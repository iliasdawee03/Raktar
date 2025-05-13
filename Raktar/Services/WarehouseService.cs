using Microsoft.EntityFrameworkCore;
using Raktar.Entity;
using static Raktar.Dtos.WarehouseStorageDto;

namespace Raktar.Services
{
    public interface IWarehouseService
    {
        Task<List<WarehouseStorageReadDto>> GetAllStorageAsync();
        Task<bool> AssignToStorage(int productId, LocationCode location);
    }
    public class WarehouseService : IWarehouseService
    {
        private readonly AppDbContext _context;

        public WarehouseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<WarehouseStorageReadDto>> GetAllStorageAsync()
        {
            var storage = await _context.WarehouseStorages
                .Include(ws => ws.Product)
                .ToListAsync();

            return storage.Select(ws => new WarehouseStorageReadDto
            {
                Id = ws.Id,
                ProductId = ws.ProductId,
                ProductName = ws.Product.Name,
                LocationCode = ws.LocationCode,
                Quantity = ws.Quantity,
            }).ToList();
        }

        public async Task<bool> AssignToStorage(int productId, LocationCode location)
        {
            var entry = new WarehouseStorage
            {
                ProductId = productId,
                LocationCode = location,
            };

            await _context.WarehouseStorages.AddAsync(entry);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
