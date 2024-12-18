using Microsoft.EntityFrameworkCore;

public class InitialMigrations : DbContext {
    public InitialMigrations(DbContextOptions<InitialMigrations> options) : base(options) {}
}