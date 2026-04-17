#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="docker-compose-dev.yml"
ENV_FILE="dev-env.list"

docker-compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" down
docker-compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" build --no-cache
docker-compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up --force-recreate
