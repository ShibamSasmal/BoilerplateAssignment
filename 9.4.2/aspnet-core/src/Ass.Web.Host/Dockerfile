FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["src/Ass.Web.Host/Ass.Web.Host.csproj", "src/Ass.Web.Host/"]
COPY ["src/Ass.Web.Core/Ass.Web.Core.csproj", "src/Ass.Web.Core/"]
COPY ["src/Ass.Application/Ass.Application.csproj", "src/Ass.Application/"]
COPY ["src/Ass.Core/Ass.Core.csproj", "src/Ass.Core/"]
COPY ["src/Ass.EntityFrameworkCore/Ass.EntityFrameworkCore.csproj", "src/Ass.EntityFrameworkCore/"]
WORKDIR "/src/src/Ass.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/Ass.Web.Host", "src/Ass.Web.Host"]
COPY ["src/Ass.Web.Core", "src/Ass.Web.Core"]
COPY ["src/Ass.Application", "src/Ass.Application"]
COPY ["src/Ass.Core", "src/Ass.Core"]
COPY ["src/Ass.EntityFrameworkCore", "src/Ass.EntityFrameworkCore"]
WORKDIR "/src/src/Ass.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "Ass.Web.Host.dll"]
