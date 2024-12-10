using AspNetCore.Identity.Mongo.Model;
using MongoDB.Bson;

public class UserSchema : MongoUser {

    public UserSchema(string __Id, string __Role) {
        Id = new ObjectId();
        Roles = [__Role];
        UserName = __Id;
    }
}