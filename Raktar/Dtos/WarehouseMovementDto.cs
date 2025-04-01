using Raktar.Entity;
using System.ComponentModel.DataAnnotations;
namespace Raktar.Dtos
{
    public class WarehouseMovementDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public StorageLocation location { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public class WarehouseMovementCreateDto
    {
        [Required]
        public int ProductId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        [Required]
        public StorageLocation location { get; set; }
    }
    public class WarehouseMovementUpdateDto
    {
        [Required]
        public int ProductId { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public string MovementType { get; set; }
        [Required]
        public StorageLocation location { get; set; }
    }
}
