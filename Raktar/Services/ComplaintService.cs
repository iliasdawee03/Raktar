using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Raktar.Entity;
using static Raktar.Dtos.ComplaintDto;

namespace Raktar.Services
{
    public interface IComplaintService
    {
        Task<List<ComplaintReadDto>> GetAllAsync();
        Task<ComplaintReadDto?> GetByIdAsync(int id);
        Task<ComplaintReadDto> CreateAsync(ComplaintCreateDto dto);
        Task<bool> DeleteAsync(int id);
    }
    public class ComplaintService : IComplaintService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ComplaintService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<ComplaintReadDto>> GetAllAsync()
        {
            var complaints = await _context.Complaints
                .Include(c => c.User)
                .Include(c => c.Order)
                .ToListAsync();
            return _mapper.Map<List<ComplaintReadDto>>(complaints);
        }

        public async Task<ComplaintReadDto?> GetByIdAsync(int id)
        {
            var complaint = await _context.Complaints
                .Include(c => c.User)
                .Include(c => c.Order)
                .FirstOrDefaultAsync(c => c.Id == id);

            return complaint == null ? null : _mapper.Map<ComplaintReadDto>(complaint);
        }

        public async Task<ComplaintReadDto> CreateAsync(ComplaintCreateDto dto)
        {
            var complaint = _mapper.Map<Complaint>(dto);
            complaint.CreatedAt = DateTime.UtcNow;

            await _context.Complaints.AddAsync(complaint);
            await _context.SaveChangesAsync();
            return _mapper.Map<ComplaintReadDto>(complaint);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var complaint = await _context.Complaints.FindAsync(id);
            if (complaint == null)
                return false;

            _context.Complaints.Remove(complaint);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
