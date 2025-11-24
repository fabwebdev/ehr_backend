# Charts Backend Express

This is a Node.js/Express.js conversion of the original Laravel backend for the Charts healthcare application.

## Overview

This project is a complete conversion of a Laravel backend to Express.js, maintaining all the original functionality including:
- User authentication with Better Auth
- Patient management system
- Pain assessment modules
- Nursing clinical notes
- PDF and Excel generation
- WebSocket support for real-time communication
- Comprehensive API endpoints

## Features

- **Authentication**: Better Auth-based authentication system with session management
- **OAuth Support**: Google and GitHub authentication
- **Database**: SQLite for development, PostgreSQL for production
- **API**: RESTful API endpoints matching the original Laravel structure
- **CLI**: Command-line interface for administrative tasks
- **Real-time**: WebSocket support for broadcasting events
- **File Generation**: PDF and Excel document generation
- **Caching**: Built-in caching system
- **Email**: Email sending capabilities
- **Permissions**: Role-based access control system
- **Queues**: Job queue system
- **Sessions**: Session management
- **Logging**: Comprehensive logging system

## Installation

1. Clone the repository
2. Navigate to the express-server directory:
   ```bash
   cd express-server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the .env.example file to .env and configure your environment variables:
   ```bash
   cp .env.example .env
   ```

## Usage

### Starting the Server

```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

### CLI Commands

```bash
# Show available commands
node src/console/cli.js --help

# Seed the database
node src/console/cli.js seed

# Sync database models
node src/console/cli.js sync

# Create a user
node src/console/cli.js make:user

# List routes
node src/console/cli.js route:list

# Show an inspiring quote
node src/console/cli.js inspire
```

### Environment Variables

The following environment variables can be configured in the .env file:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development|production)
- `BETTER_AUTH_SECRET`: Better Auth secret key
- `BETTER_AUTH_URL`: Better Auth base URL
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_DIALECT`: Database dialect (postgres|sqlite)

## API Endpoints

All API endpoints are prefixed with `/api/` and maintain the same structure as the original Laravel application.

### Authentication

The application uses **cookie-based authentication** powered by [Better Auth](https://www.better-auth.com/). All authentication is handled automatically through secure HTTP-only cookies.

- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login with email and password
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current user session
- `GET /api/user` - Get authenticated user (legacy endpoint)

### OAuth Authentication

The application supports OAuth authentication with Google and GitHub:

- `GET /api/auth/sign-in/google` - Google authentication
- `GET /api/auth/sign-in/github` - GitHub authentication

**Note**: OAuth providers require proper configuration in environment variables.

### Patient Management
- `GET /api/patients` - List all patients
- `POST /api/patients` - Create a new patient
- `GET /api/patients/:id` - Get a specific patient
- `PUT /api/patients/:id` - Update a patient
- `DELETE /api/patients/:id` - Delete a patient

### Pain Assessment
- Various endpoints for pain assessment modules

### Nursing Clinical Notes
- Various endpoints for nursing clinical notes

## Database

The application uses SQLite for development and can be configured to use PostgreSQL for production.

### Sequelize Migrations

The application includes a full migration system converted from Laravel's migration system. Migrations are located in the `migrations/` directory and can be run using Sequelize CLI:

```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Run all pending migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo
```

**Note**: Migration files use the `.cjs` extension to work with Sequelize CLI in an ES module project.

To sync the database models (alternative to migrations):
```bash
npm run sync
```

To seed the database with initial data:
```bash
npm run seed
```

## Testing

The application includes comprehensive test scripts for verifying functionality:

### Test Cookie-Based Authentication
```bash
node test-cookie-auth.js
```

### Test All Endpoints
```bash
node test-all-endpoints.js
```

**Note**: Tests automatically handle cookie-based authentication and session management.

## Architecture

The application follows Laravel-like architecture patterns in Node.js:

- **Service Container**: Dependency injection container
- **Facades**: Static interface to classes
- **Service Providers**: Bootstrap application services
- **Middleware**: HTTP request filtering
- **Controllers**: Handle HTTP requests
- **Models**: Database models with relationships
- **Routes**: URL routing
- **Configuration**: Centralized configuration system
- **Console Commands**: CLI commands
- **Events**: Event broadcasting
- **Exceptions**: Error handling

## Development

The application uses ES modules and requires Node.js 14+.

## License

This project is licensed under the MIT License.