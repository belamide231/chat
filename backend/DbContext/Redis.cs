using StackExchange.Redis;
using backend.Configurations;

namespace Database;

public class Redis {

    private readonly IConnectionMultiplexer _Connection;
    public Redis() {
        _Connection = ConnectionMultiplexer.Connect(DbContext._RedistUrl);
    }
}