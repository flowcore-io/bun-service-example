# Bun Service Example



### Environment Variables

| Environment Variable            | Description                         |   Type   | Default Value | Required |
|---------------------------------|-------------------------------------|:--------:|---------------|:--------:|
| LOG_LEVEL                       | The log level                       | `string` | `info`        |          |
| LOG_PRETTY                      | Whether to log in pretty format     | `int`    | `0`           |          |
| SERVICE_PORT                    | The port the service will listen on | `int`    | `3000`        |          |
| POSTGRES_CONNECTION_STRING      | Database connection string          | `string` |               |   Yes    |
| POSTGRES_QUERY_LOG              | Whether to log database queries     | `int`    | `0`           |          |
| TRANSFORMER_SECRET              | Transformer secret                  | `string` |               |   Yes    |

| FLOWCORE_API_KEY                | Flowcore API key                    | `string` |               |   Yes    |
| FLOWCORE_TENANT                 | Flowcore tenant                     | `string` |               |   Yes    |
| FLOWCORE_DATA_CORE              | Flowcore data core                  | `string` |               |   Yes    |
| FLOWCORE_WEBHOOK_BASE_URL       | Flowcore webhook base url           | `string` |               |   Yes    |
| SCHEDULER_CRON                  | The cron schedule for the scheduler | `string` | `*/10 * * * *`|          |

# Development

## App setup

```bash
# Install/update dependencies
bun install

# Make a copy of the .env.example to .env
cp .env.example .env

# You can create a new api key in flowcore and set the `FLOWCORE_API_KEY` environment variable in the `.env` file.
```
## Database setup
```bash
# Start the database
bun db:up

# Push the database schema
bun db:push
```

## Building

```bash
# Start the app in watch mode
bun dev
```

## Streaming

```bash
# This will start streaming events into the transformer, so the app needs to be running

# Start the flowcore stream from the current time
bun flowcore:stream

# OR

# Start the flowcore stream from beginning
bun flowcore:backfill
```
## Testing

```bash
# Run tests
bun test
```
