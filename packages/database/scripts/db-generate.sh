#!/bin/bash
# Script to generate Prisma client

pnpm prisma generate --schema=packages/database/prisma/schema.prisma
