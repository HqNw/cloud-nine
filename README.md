# Cloud Computing Project

## Prerequisites

- Docker and Docker Compose
- Git

## Installation

```bash
git clone <repository-url>
cd CSC322-Cloud-Architecture-and-Computing
```

## Running the Project

### Using Docker

```bash
# Build and start containers
docker-compose up --build

# Run in background
docker-compose up -d

# Access at http://localhost:3000
```

### Managing Docker Containers

```bash
# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

## Development Guide


### Development

1. Create branch: `git checkout -b feature/name`
2. Test within Docker: `docker-compose up -w`
3. Commit changes: `git commit -am "Message"`
4. Push changes: `git push origin feature/name`
5. Create pull request


