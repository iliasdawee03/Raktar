using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Raktar.Entity;
using static Raktar.Dtos.DeliveryFormDto;

namespace Raktar.Services
{
    public interface IDeliveryFormService
    {
        Task<List<DeliveryFormReadDto>> GetAllAsync();
        Task<DeliveryFormReadDto?> GetByIdAsync(int id);
        Task<DeliveryFormCreateDto> CreateAsync(DeliveryFormCreateDto dto);
        Task<DeliveryFormUpdateDto?> UpdateAsync(int id, DeliveryFormUpdateDto dto);
    }
    public class DeliveryFormService : IDeliveryFormService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public DeliveryFormService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<DeliveryFormReadDto>> GetAllAsync()
        {
            var forms = await _context.DeliveryForms
                .Include(f => f.Supplier)
                .Include(static f => f.DeliveredProducts)
                    .ThenInclude(dp => dp.Product)
                .ToListAsync();

            return _mapper.Map<List<DeliveryFormReadDto>>(forms);
        }

        public async Task<DeliveryFormReadDto?> GetByIdAsync(int id)
        {
            var form = await _context.DeliveryForms
                .Include(f => f.Supplier)
                .Include(f => f.DeliveredProducts)
                    .ThenInclude(dp => dp.Product)
                .FirstOrDefaultAsync(f => f.Id == id);

            return form == null ? null : _mapper.Map<DeliveryFormReadDto>(form);
        }

        public async Task<DeliveryFormCreateDto> CreateAsync(DeliveryFormCreateDto dto)
        {
            var form = _mapper.Map<DeliveryForm>(dto);
            form.CreatedAt = DateTime.UtcNow;
            form.Status = "Filled";
            await _context.DeliveryForms.AddAsync(form);
            await _context.SaveChangesAsync();
            return _mapper.Map<DeliveryFormCreateDto>(form);
        }
        public async Task<DeliveryFormUpdateDto?> UpdateAsync(int id, DeliveryFormUpdateDto dto)
        {
            var form = await _context.DeliveryForms.FirstOrDefaultAsync(f => f.Id == id);
            if (form == null)
                return null;
            if (!string.IsNullOrEmpty(dto.Status))
                form.Status = dto.Status;
            await _context.SaveChangesAsync();
            return _mapper.Map<DeliveryFormUpdateDto>(form);
        }
    }
}
