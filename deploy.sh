#!/bin/bash

# Default values (you can replace these with your actual values)
USERNAME=${USERNAME:-"user.name@example.com"}
HOST=${HOST:-"your-server.com"}
PORT=${PORT:-"22"}
REMOTE_PATH=${REMOTE_PATH:-"/path/to/destination/"}

# Build the site
echo "Building the site..."
npm run generate

# Deploy using rsync
echo "Deploying to $USERNAME@$HOST:$REMOTE_PATH (port $PORT)..."
rsync -av --progress -e "ssh -p $PORT" .output/public/ "$USERNAME@$HOST:$REMOTE_PATH"

echo "Deployment complete!" 