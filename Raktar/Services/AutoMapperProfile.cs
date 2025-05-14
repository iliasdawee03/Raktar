using AutoMapper;
using Raktar.Entity;
using static Raktar.Dtos.ComplaintDto;
using static Raktar.Dtos.DeliveredProductDto;
using static Raktar.Dtos.DeliveryFormDto;
using static Raktar.Dtos.OrderDto;
using static Raktar.Dtos.OrderItemDto;
using static Raktar.Dtos.ProductDto;
using static Raktar.Dtos.TransportDto;
using static Raktar.Dtos.UserDto;
using static Raktar.Dtos.WarehouseStorageDto;

namespace Raktar.Services
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // User
            CreateMap<UserCreateDto, User>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());
            CreateMap<User, UserCreateDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Phone))
                .ForMember(dest => dest.Password, opt => opt.Ignore());
            CreateMap<User, UserReadDto>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone));
            CreateMap<UserUpdateDto, User>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.Role, opt => opt.Ignore());

            // Product
            CreateMap<Product, ProductReadDto>();
            CreateMap<ProductCreateDto, Product>();

            // Order
            CreateMap<Order, OrderReadDto>();
            CreateMap<OrderCreateDto, Order>();
            CreateMap<OrderItem, OrderItemReadDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name));
            CreateMap<OrderItemCreateDto, OrderItem>();

            // Complaint
            CreateMap<Complaint, ComplaintReadDto>();
            CreateMap<ComplaintCreateDto, Complaint>();
            CreateMap<Complaint, ComplaintCreateDto>();

            // DeliveryForm
            CreateMap<DeliveryForm, DeliveryFormReadDto>();
            CreateMap<DeliveryFormCreateDto, DeliveryForm>().ReverseMap();
            CreateMap<DeliveredProduct, DeliveredProductReadDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name));
            CreateMap<DeliveredProductCreateDto, DeliveredProduct>().ReverseMap();
            CreateMap<DeliveryFormUpdateDto, DeliveryForm>().ReverseMap();

            // Transport
            CreateMap<Transport, TransportReadDto>();
            CreateMap<TransportCreateDto, Transport>();

            // WarehouseStorage
            CreateMap<WarehouseStorage, WarehouseStorageReadDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name));
            CreateMap<WarehouseStorageCreateDto, WarehouseStorage>();
        }
    }
}
