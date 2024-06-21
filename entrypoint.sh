#!/bin/sh

# Run Prisma DB push to apply schema changes
pnpm prisma db push

# Start the application
pnpm run start:dev