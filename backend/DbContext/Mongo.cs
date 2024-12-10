using MongoDB.Driver;
using backend.Configurations;

namespace Database;

public class Mongo {

    private readonly IMongoDatabase _Connection;
    public Mongo() {
        var ConnectionString = MongoUrl.Create(DbContext._MongoUrl);            
        _Connection = new MongoClient(ConnectionString).GetDatabase(ConnectionString.DatabaseName);
    }

    public IMongoCollection<UserSchema> UserCollection() => _Connection.GetCollection<UserSchema>("UserCollection"); // TEMPORARY
    public IMongoCollection<RoleSchema> RoleCollection() => _Connection.GetCollection<RoleSchema>("RoleCollection"); // TEMPORARY
    public IMongoCollection<ConversationSchema> ConversationCollection() => _Connection.GetCollection<ConversationSchema>("ConversationCollection");
    public IMongoCollection<MessageSchema> MessageCollection() => _Connection.GetCollection<MessageSchema>("MessageCollection");
    public IMongoCollection<UserDataSchema> UserDataCollection() => _Connection.GetCollection<UserDataSchema>("UserDataCollection");
}