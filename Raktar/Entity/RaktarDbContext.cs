using System.Security.Cryptography.X509Certificates;
using System.Threading;
using Microsoft.EntityFrameworkCore;

namespace Raktar.Entity
{
    public class RaktarDbContext : DbContext
    {
        public RaktarDbContext(DbContextOptions<RaktarDbContext> options) : base(options) { }

        public DbSet<User> User { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Complaint> Complaints { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Carrier> Carriers { get; set; }
        public DbSet<Delivery> Deliveries { get; set; }
        public DbSet<WarehouseWorker> WarehouseWorkers { get; set; }
        public DbSet<StorageLocation> StorageLocations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
