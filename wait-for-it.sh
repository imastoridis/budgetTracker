#!/bin/bash
# wait-for-it.sh: Wait for network services to become available

set -e

# Target hostname and port are passed as arguments
host="$1"
port="$2"
shift 2
cmd="$@"

echo "Waiting for $host:$port..."

# Loop until netcat (nc) can successfully connect to the port
while ! nc -z "$host" "$port"; do
  sleep 1
done

echo "$host:$port is available. Executing command."
# Execute the original Spring Boot start command
exec $cmd