// dotnet add package AspNetCore.Identity.Mongo
// dotnet add package MongoDb.Driver
// dotnet add package StackExchange.Redis
// dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
// dotnet add package Newtonsoft.Json


using backend.WebSockets;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Database;
using Microsoft.AspNetCore.Authorization;
using backend.Helpers;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);
// builder.WebHost.UseUrls("https://0.0.0.0:443"); https
// builder.WebHost.UseUrls("http://0.0.0.0:80"); http


builder.Services.AddDbContext<InitialMigrations>(options =>
    options.UseMySql(backend.Configurations.DbContext._MysqlMigrationsUrl,
        new MySqlServerVersion(new Version(9, 1, 0))));


var WebSocketServer = new WebSocketServer(); // HERE
builder.Services.AddSingleton(WebSocketServer);
builder.Services.AddSingleton<Mysql>();
builder.Services.AddSingleton<Redis>();
builder.Services.AddTransient<IAuthorizationHandler, UserHandler>();
builder.Services.AddTransient<MessageServices>();
builder.Services.AddTransient<TestingServices>();
builder.Services.AddCors(
    option => {
        option.AddPolicy("*", policy => {
            policy.AllowAnyHeader();
            policy.AllowAnyMethod();
            policy.AllowAnyOrigin();
        }
    );
});
builder.Services.AddAuthorizationBuilder();
builder.Services.AddAuthentication(
    option => {
        option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }
).AddJwtBearer(
    option => {
        option.TokenValidationParameters = JwtHelper._TokenValidationParameters;
    }
).AddBearerToken(IdentityConstants.BearerScheme); 
builder.Services.AddAuthorization(
    option => {
        option.AddPolicy("user", policy => policy.AddRequirements(new UserRequirement()));
    }
);
builder.Services.AddControllersWithViews();


var app = builder.Build();


if (!app.Environment.IsDevelopment()) {
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}


app.UseCors("*");
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.UseWebSockets();
app.UseMiddleware<WebSocketAuthorization>();


// TESTING
Console.WriteLine("User: " + JwtHelper.CreateToken("helsi", "User"));
Console.WriteLine("AccountManager: " + JwtHelper.CreateToken("timoy", "AccountManager"));


app.Run();


