using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Raktar.Entity;
using static Raktar.Dtos.ProductDto;

namespace Raktar.Services
{
    public interface IProductService
    {
        Task<List<ProductReadDto>> GetAllAsync();
        Task<ProductReadDto?> GetByIdAsync(int id);
        Task<ProductReadDto> CreateAsync(ProductCreateDto dto);
        Task<bool> UpdateAsync(int id, ProductCreateDto dto);
        Task<bool> DeleteAsync(int id);
    }
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ProductService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<ProductReadDto>> GetAllAsync()
        {
            var products = await _context.Products.ToListAsync();
            return _mapper.Map<List<ProductReadDto>>(products);
        }

        public async Task<ProductReadDto?> GetByIdAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            return product == null ? null : _mapper.Map<ProductReadDto>(product);
        }

        public async Task<ProductCreateDto> CreateAsync(ProductCreateDto dto)
        {
            var product = _mapper.Map<Product>(dto);
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return _mapper.Map<ProductCreateDto>(product);
        }

        public async Task<bool> UpdateAsync(int id, ProductCreateDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return false;

            _mapper.Map(dto, product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
