using Raktar.Entity;

namespace Raktar.Dtos
{
    public class WarehouseStorageDto
    {
        public class WarehouseStorageReadDto
        {
            public int Id { get; set; }
            public int ProductId { get; set; }
            public string ProductName { get; set; }
            public LocationCode LocationCode { get; set; }
            public int Quantity { get; set; }
        }

        public class WarehouseStorageCreateDto
        {
            public int ProductId { get; set; }
            public LocationCode LocationCode { get; set; }
            public int Quantity { get; set; }
        }

        public class WarehouseStorageUpdateDto
        {
            public int ProductId { get; set; }
            public LocationCode LocationCode { get; set; }
            public int Quantity { get; set; }
        }
    }
}
