using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Raktar.Entity;
using static Raktar.Dtos.TransportDto;

namespace Raktar.Services
{
    public interface ITransportService
    {
        Task<List<TransportReadDto>> GetAllAsync();
        Task<TransportReadDto?> GetByIdAsync(int id);
        Task<TransportCreateDto> CreateAsync(TransportCreateDto dto);
        Task<bool> UpdateStatusAsync(int id, string newStatus);
    }
    public class TransportService : ITransportService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public TransportService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<TransportReadDto>> GetAllAsync()
        {
            var transports = await _context.Transports
                .Include(t => t.Order)
                .Include(t => t.Carrier)
                .ToListAsync();
            return _mapper.Map<List<TransportReadDto>>(transports);
        }

        public async Task<TransportReadDto?> GetByIdAsync(int id)
        {
            var transport = await _context.Transports
                .Include(t => t.Order)
                .Include(t => t.Carrier)
                .FirstOrDefaultAsync(t => t.Id == id);

            return transport == null ? null : _mapper.Map<TransportReadDto>(transport);
        }

        public async Task<TransportCreateDto> CreateAsync(TransportCreateDto dto)
        {
            var transport = _mapper.Map<Transport>(dto);
            transport.Status = "Ready";

            await _context.Transports.AddAsync(transport);
            await _context.SaveChangesAsync();
            return _mapper.Map<TransportCreateDto>(transport);
        }

        public async Task<bool> UpdateStatusAsync(int id, string newStatus)
        {
            var transport = await _context.Transports.FindAsync(id);
            if (transport == null)
                return false;

            transport.Status = newStatus;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
