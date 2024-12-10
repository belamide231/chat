using Database;
using Microsoft.AspNetCore.Authorization;

public class UserRequirement : IAuthorizationRequirement {}
public class UserHandler : AuthorizationHandler<UserRequirement> {

    private readonly Mongo _Mongo;
    private readonly Redis _Redis;
    public UserHandler(Mongo __Mongo, Redis __Redis) {
        _Mongo = __Mongo;
        _Redis = __Redis;
    }
    
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, UserRequirement requirement) {

        context.Succeed(requirement);
        return;
    }
}
