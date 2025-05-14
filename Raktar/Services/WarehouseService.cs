using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Raktar.Entity;
using static Raktar.Dtos.UserDto;
using static Raktar.Dtos.WarehouseStorageDto;

namespace Raktar.Services
{
    public interface IWarehouseService
    {
        Task<List<WarehouseStorageReadDto>> GetAllStorageAsync();
        Task<bool> AssignToStorage(WarehouseStorageCreateDto dto);
    }
    public class WarehouseService : IWarehouseService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public WarehouseService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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

        public async Task<bool> AssignToStorage(WarehouseStorageCreateDto dto)
        {
            var warehouseStorage = _mapper.Map<WarehouseStorage>(dto);
            await _context.WarehouseStorages.AddAsync(warehouseStorage);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
