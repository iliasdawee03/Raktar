using Microsoft.EntityFrameworkCore;

namespace Raktar.Entity
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Complaint> Complaints { get; set; }
        public DbSet<DeliveryForm> DeliveryForms { get; set; }
        public DbSet<DeliveredProduct> DeliveredProducts { get; set; }
        public DbSet<Transport> Transports { get; set; }
        public DbSet<WarehouseStorage> WarehouseStorages { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Customer)
                .WithMany()
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Complaint>()
                .HasOne(c => c.Order)
                .WithMany()
                .HasForeignKey(c => c.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Complaint>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DeliveryForm>()
                .HasOne(df => df.Supplier)
                .WithMany()
                .HasForeignKey(df => df.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DeliveredProduct>()
                .HasOne(dp => dp.DeliveryForm)
                .WithMany(df => df.DeliveredProducts)
                .HasForeignKey(dp => dp.DeliveryFormId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DeliveredProduct>()
                .HasOne(dp => dp.Product)
                .WithMany()
                .HasForeignKey(dp => dp.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Transport>()
                .HasOne(t => t.Carrier)
                .WithMany()
                .HasForeignKey(t => t.CarrierId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Transport>()
                .HasOne(t => t.Order)
                .WithMany()
                .HasForeignKey(t => t.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WarehouseStorage>()
                .HasOne(ws => ws.Product)
                .WithMany()
                .HasForeignKey(ws => ws.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
