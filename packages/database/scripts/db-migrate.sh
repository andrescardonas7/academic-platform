#!/bin/bash
# Script to run Prisma migrations

pnpm prisma migrate dev --schema=packages/database/prisma/schema.prisma
