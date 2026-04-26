#!/usr/bin/env sh
set -eu

DB_PATH="${MMFLOW_DB_PATH:-}"

if [ -z "$DB_PATH" ]; then
  echo "MMFLOW_DB_PATH is not set"
  exit 1
fi

mkdir -p "$(dirname "$DB_PATH")"

if [ ! -s "$DB_PATH" ]; then
  java -cp /app/mmflow-0.0.1-SNAPSHOT-all.jar com.mehtasankets.mmflow.dao.DbBootstrapKt
fi

exec java -server -jar /app/mmflow-0.0.1-SNAPSHOT-all.jar
