namespace backend.Configurations;

public class DbContext {

    public static string _RedistUrl = "127.0.0.1:6379";
    public static string _MysqlUrl = "Server=localhost;Database=chat;User ID=root;Password=belamide231;Pooling=true;Min Pool Size=5;Max Pool Size=100;Connection Timeout=30;";
    public static string _MysqlMigrationsUrl = "Server=localhost;Database=chat;User=root;Password=belamide231;";   
    
}