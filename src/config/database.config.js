// Database configuration that matches Laravel's config/database.php
const databaseConfig = {
  // Database Default
  default: process.env.DB_CONNECTION || 'sqlite',
  
  // Database Connections
  connections: {
    sqlite: {
      driver: 'sqlite',
      url: process.env.DATABASE_URL,
      database: process.env.DB_DATABASE || 'database.sqlite',
      prefix: '',
      foreign_key_constraints: process.env.DB_FOREIGN_KEYS || true,
    },
    
    mysql: {
      driver: 'mysql',
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || '3306',
      database: process.env.DB_DATABASE || 'forge',
      username: process.env.DB_USERNAME || 'forge',
      password: process.env.DB_PASSWORD || '',
      unix_socket: process.env.DB_SOCKET || '',
      charset: 'utf8mb4',
      collation: 'utf8mb4_unicode_ci',
      prefix: '',
      prefix_indexes: true,
      strict: true,
      engine: null,
      options: {
        // PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
      },
    },
    
    pgsql: {
      driver: 'pgsql',
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || '5432',
      database: process.env.DB_DATABASE || 'postgresdb',
      username: process.env.DB_USERNAME || 'hospici',
      password: process.env.DB_PASSWORD || 'hospici',
      charset: 'utf8',
      prefix: '',
      prefix_indexes: true,
      search_path: 'public',
      sslmode: 'prefer',
    },
    
    sqlsrv: {
      driver: 'sqlsrv',
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '1433',
      database: process.env.DB_DATABASE || 'forge',
      username: process.env.DB_USERNAME || 'forge',
      password: process.env.DB_PASSWORD || '',
      charset: 'utf8',
      prefix: '',
      prefix_indexes: true,
    },
  },
  
  // Migration Repository Table
  migrations: 'migrations',
  
  // Redis Databases
  redis: {
    client: process.env.REDIS_CLIENT || 'phpredis',
    
    options: {
      cluster: process.env.REDIS_CLUSTER || 'redis',
    },
    
    clusters: {
      default: [
        {
          url: process.env.REDIS_URL || null,
          host: process.env.REDIS_HOST || '127.0.0.1',
          password: process.env.REDIS_PASSWORD || null,
          port: process.env.REDIS_PORT || '6379',
          database: process.env.REDIS_DB || '0',
        },
      ],
    },
    
    default: {
      url: process.env.REDIS_URL || null,
      host: process.env.REDIS_HOST || '127.0.0.1',
      password: process.env.REDIS_PASSWORD || null,
      port: process.env.REDIS_PORT || '6379',
      database: process.env.REDIS_DB || '0',
    },
  },
};

export default databaseConfig;