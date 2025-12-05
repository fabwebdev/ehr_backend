# Project Structure

This document describes the organized structure of the Express Server project.

## Directory Structure

```
express-server-main/
├── database/                    # Database-related files
│   ├── migrations/              # All database migrations
│   │   ├── drizzle/            # Drizzle ORM migrations
│   │   └── prisma/              # Prisma migrations
│   └── config/                  # Database configuration files
│       └── config.json          # Sequelize config (legacy)
│
├── docs/                        # Documentation files
│   ├── ALL_ROUTES.md           # API routes documentation
│   ├── ALL_ROUTES_DETAILS/     # Detailed route documentation
│   └── AUDIT_CONTROLS_README.md # Audit controls documentation
│
├── scripts/                     # Utility and maintenance scripts
│   ├── database/               # Database-related scripts
│   │   ├── migrate.js          # Migration runner
│   │   ├── comprehensive-fix.js
│   │   ├── corrected-fix.js
│   │   ├── render-fix.js
│   │   └── ...                 # Other database utility scripts
│   ├── fix_patients_columns.js
│   └── fix_user_has_roles.js
│
├── src/                         # Source code
│   ├── bootstrap/              # Application bootstrap
│   ├── config/                 # Configuration files
│   ├── console/                # CLI commands
│   ├── controllers/            # Request handlers
│   ├── database/               # Database core files
│   │   ├── connection.js       # Database connection
│   │   ├── seed.js             # Database seeding
│   │   ├── sync.js             # Database sync
│   │   ├── factories/          # Model factories
│   │   └── seeders/            # Database seeders
│   ├── db/                     # Database schemas
│   │   └── schemas/            # Drizzle schemas
│   ├── enums/                  # Enum definitions
│   ├── exceptions/             # Exception handlers
│   ├── facades/                # Facade classes
│   ├── helpers/                # Helper functions
│   ├── Http/                   # HTTP-related classes
│   ├── middleware/             # Express middleware
│   ├── providers/              # Service providers
│   ├── routes/                 # Route definitions
│   ├── services/               # Business logic services
│   ├── utils/                  # Utility functions
│   └── validators/             # Validation logic
│
├── public/                      # Static files
├── storage/                     # File storage
├── tests/                       # Test files
│
├── server.js                    # Main server entry point
├── start.js                     # Server startup script
├── drizzle.config.js           # Drizzle ORM configuration
├── jest.config.js              # Jest test configuration
├── package.json                # Node.js dependencies
└── README.md                   # Project README
```

## Key Changes Made

1. **Documentation Organization**: All documentation files moved to `docs/` folder
2. **Database Migrations**: Consolidated all migrations under `database/migrations/`
3. **Scripts Organization**: Database utility scripts moved to `scripts/database/`
4. **Configuration**: Database config files moved to `database/config/`

## File Locations

### Migrations
- Drizzle migrations: `database/migrations/drizzle/`
- Prisma migrations: `database/migrations/prisma/`

### Scripts
- Migration runner: `scripts/database/migrate.js`
- Database fixes: `scripts/database/`
- Patient/User fixes: `scripts/`

### Documentation
- API routes: `docs/ALL_ROUTES.md`
- Route details: `docs/ALL_ROUTES_DETAILS/`
- Audit controls: `docs/AUDIT_CONTROLS_README.md`

## Updated Scripts

The following npm scripts have been updated to reflect new file locations:
- `migrate:auto` → `scripts/database/migrate.js`
- `test:drizzle` → `scripts/database/test.drizzle.js`
- `test:auth-drizzle` → `scripts/database/test.better-auth.drizzle.js`
- `test:schemas` → `scripts/database/test_schemas.drizzle.js`
- All `fix:*` scripts → `scripts/database/`
- `env:check` → `scripts/database/env-check.js`
- `db:test:render` → `scripts/database/render-db-test.js`

## Configuration Updates

- `drizzle.config.js`: Updated to point migrations to `./database/migrations/drizzle`
- `scripts/database/migrate.js`: Updated import paths and migration folder path

