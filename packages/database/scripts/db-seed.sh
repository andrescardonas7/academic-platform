#!/bin/bash
# Script to seed the database

pnpm prisma db seed --schema=packages/database/prisma/schema.prisma
