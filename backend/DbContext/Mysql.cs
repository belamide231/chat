using MySql.Data.MySqlClient;
using backend.Configurations;

namespace Database;

public class Mysql {
    private readonly string _ConnectionString;

    public Mysql() {
        //"Server=localhost;Database=chat;User ID=root;Password=belamide231;Pooling=true;Min Pool Size=5;Max Pool Size=100;Connection Timeout=30;" THE VALUE OF THE DbContext._MysqlUrl
        _ConnectionString = DbContext._MysqlUrl;
    }

    public MySqlConnection GetConnection() {

        var Connection = new MySqlConnection(_ConnectionString); // SO THIS IS CREATING A NEW POOL?
        Connection.Open();
        return Connection;
    }
}
