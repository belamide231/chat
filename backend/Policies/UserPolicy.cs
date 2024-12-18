using Database;
using Microsoft.AspNetCore.Authorization;

public class UserRequirement : IAuthorizationRequirement {}
public class UserHandler : AuthorizationHandler<UserRequirement> {

    private readonly Redis _Redis;
    public UserHandler(Redis __Redis) {
        _Redis = __Redis;
    }
    
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, UserRequirement requirement) {

        context.Succeed(requirement);
        return;
    }
}
