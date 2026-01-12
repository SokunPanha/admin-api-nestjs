#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until nc -z postgres 5432; do
  echo "Waiting for postgres..."
  sleep 2
done

echo "Database is ready!"

echo "Running database migrations..."
npm run migration:run || echo "Migration failed or no migrations to run"

echo "Seeding database..."
npm run seed:run || echo "Seed failed or already seeded"

echo "Starting application..."
exec "$@"
