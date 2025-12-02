# Audit Controls Implementation

This document describes the audit controls implemented for health data operations.

## Overview

All health data operations (create, read, update, delete) are now logged to:
1. **Database** - `audit_logs` table for internal audit trail
2. **Pino Logger** - Fastify's default logger for structured logging
3. **External Systems** - Configurable external log storage (Splunk, Elasticsearch, CloudWatch, etc.)

## Key Features

✅ **Comprehensive Logging**: All patient data operations are logged
✅ **No Health Data in Logs**: Only metadata is logged (user, action, timestamp, IP, user agent)
✅ **Pino Logger**: Uses Fastify's default Pino logger for performance
✅ **External Storage**: Supports Splunk, Elasticsearch, AWS CloudWatch, and custom HTTP endpoints
✅ **Tamper-Proof**: Logs stored in database and external systems

## What Gets Logged

For each health data operation, the following information is logged:

- **User ID**: Who performed the action
- **Action**: CREATE, READ, UPDATE, or DELETE
- **Table/Resource Name**: Which table/resource was accessed (e.g., 'patients', 'discharge')
- **Record ID**: Which specific record was affected
- **IP Address**: Where the request came from
- **User Agent**: Browser/client information
- **Timestamp**: When the action occurred

**Important**: Actual health data values are NEVER logged. Only metadata about the operation is recorded.

## Configuration

### Environment Variables

Add these to your `.env` file to enable external log storage:

#### Splunk Configuration
```env
SPLUNK_URL=https://your-splunk-instance.com:8088
SPLUNK_TOKEN=your-splunk-token
SPLUNK_SOURCE=healthcare-api
SPLUNK_SOURCETYPE=audit
```

#### Elasticsearch Configuration
```env
ELASTICSEARCH_URL=https://your-elasticsearch-instance.com:9200
ELASTICSEARCH_INDEX=audit-logs
ELASTICSEARCH_USERNAME=your-username
ELASTICSEARCH_PASSWORD=your-password
```

#### AWS CloudWatch Configuration
```env
AWS_CLOUDWATCH_LOG_GROUP=healthcare-audit-logs
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

#### Generic HTTP Endpoint (for custom log managers)
```env
EXTERNAL_LOG_URL=https://your-log-manager.com/api/logs
EXTERNAL_LOG_TOKEN=your-auth-token
EXTERNAL_LOG_HEADERS={"X-Custom-Header":"value"}
```

### Logger Configuration

The Pino logger is configured in `server.js` with:
- **Redaction**: Automatically removes sensitive data from logs
- **Structured Logging**: JSON format for easy parsing
- **Performance**: Pino is one of the fastest Node.js loggers

## Implementation Details

### Audit Middleware

The audit middleware (`src/middleware/audit.middleware.js`) provides:
- `audit(action, tableName)`: Pre-handler middleware to mark routes for auditing
- `auditLogHandler`: Post-handler hook to log completed operations
- `logAudit(request, action, tableName, recordId)`: Helper function for manual logging

### Audit Service

The audit service (`src/services/AuditService.js`) handles:
- Database logging to `audit_logs` table
- External system integration (Splunk, Elasticsearch, CloudWatch, HTTP)
- Automatic sanitization (never logs health data)

### Controllers

All patient controllers have been updated to log operations:
- `Patient.controller.js`: CREATE, READ, UPDATE, DELETE operations
- `Discharge.controller.js`: All discharge operations
- `AdmissionInformation.controller.js`: Admission information operations
- Other patient controllers can be updated similarly

## Usage

### Automatic Logging

Most routes automatically log via the `onResponse` hook in `server.js`. The hook checks if the route is patient-related and logs accordingly.

### Manual Logging

For custom operations, use the `logAudit` helper:

```javascript
import { logAudit } from "../../middleware/audit.middleware.js";

// In your controller
await logAudit(request, 'CREATE', 'patients', patient.id);
```

## Database Schema

The `audit_logs` table structure:

```sql
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  table_name VARCHAR(255) NOT NULL,
  record_id BIGINT,
  old_value TEXT,  -- Always NULL (no health data)
  new_value TEXT,  -- Always NULL (no health data)
  ip_address VARCHAR(255),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Querying Audit Logs

### Via API

```bash
# Get all audit logs
GET /api/audit/logs

# Get logs for specific user
GET /api/audit/logs?userId=123

# Get logs for specific action
GET /api/audit/logs?action=UPDATE

# Get logs for specific table
GET /api/audit/logs?tableName=patients

# Get logs with date range
GET /api/audit/logs?startDate=2024-01-01&endDate=2024-12-31
```

### Direct Database Query

```sql
-- Get all patient access logs
SELECT * FROM audit_logs 
WHERE table_name = 'patients' 
ORDER BY created_at DESC;

-- Get all updates by a specific user
SELECT * FROM audit_logs 
WHERE user_id = 123 AND action = 'UPDATE'
ORDER BY created_at DESC;
```

## Security Considerations

1. **No Health Data**: The system is designed to never log actual health data values
2. **Redaction**: Pino logger automatically redacts sensitive fields
3. **External Storage**: Logs are sent to external systems for tamper-proof storage
4. **Access Control**: Audit log endpoints require proper authentication/authorization

## Monitoring

Monitor audit logs for:
- Unauthorized access attempts
- Unusual access patterns
- Compliance requirements (HIPAA, etc.)
- Security incidents

## Troubleshooting

### Logs Not Appearing

1. Check database connection
2. Verify `audit_logs` table exists
3. Check application logs for errors
4. Verify user authentication is working

### External Logging Not Working

1. Verify environment variables are set correctly
2. Check network connectivity to external systems
3. Verify authentication credentials
4. Check application logs for specific errors

## Compliance

This implementation helps meet:
- **HIPAA**: Audit logging requirements
- **SOC 2**: Security monitoring requirements
- **GDPR**: Data access logging requirements

## Future Enhancements

- Real-time alerting on suspicious activities
- Automated compliance reporting
- Integration with SIEM systems
- Advanced analytics and dashboards

