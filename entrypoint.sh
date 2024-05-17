#!/bin/sh
set -e

# Run TypeORM migrations
npm run typeorm:migrate

# Start the NestJS application
npm run start:prod
