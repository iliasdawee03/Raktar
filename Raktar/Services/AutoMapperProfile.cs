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
            CreateMap<User, UserReadDto>();
            CreateMap<UserCreateDto, User>();

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

            // DeliveryForm
            CreateMap<DeliveryForm, DeliveryFormReadDto>();
            CreateMap<DeliveryFormCreateDto, DeliveryForm>();
            CreateMap<DeliveredProduct, DeliveredProductReadDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name));
            CreateMap<DeliveredProductCreateDto, DeliveredProduct>();

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
