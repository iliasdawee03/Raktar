using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Raktar.Entity;
using static Raktar.Dtos.UserDto;

namespace Raktar.Services
{
    public interface IUserService
    {
        Task<List<UserReadDto>> GetAllAsync();
        Task<UserReadDto?> GetByIdAsync(int id);
        Task<UserReadDto> CreateAsync(UserCreateDto dto);
        Task<bool> UpdateAsync(int id, UserCreateDto dto);
        Task<bool> DeleteAsync(int id);
    }
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public UserService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<UserReadDto>> GetAllAsync()
        {
            var users = await _context.Users.ToListAsync();
            return _mapper.Map<List<UserReadDto>>(users);
        }

        public async Task<UserReadDto?> GetByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return user == null ? null : _mapper.Map<UserReadDto>(user);
        }

        public async Task<UserReadDto> CreateAsync(UserCreateDto dto)
        {
            var user = _mapper.Map<User>(dto);
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserReadDto>(user);
        }

        public async Task<bool> UpdateAsync(int id, UserCreateDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return false;

            _mapper.Map(dto, user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
