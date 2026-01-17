#!/bin/bash

# RobotCore - Startup Script for Mac/Linux

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting RobotCore Setup...${NC}"

# Check for node_modules in client
if [ ! -d "client/node_modules" ]; then
    echo -e "${GREEN}Installing client dependencies...${NC}"
    cd client && npm install && cd ..
else
    echo -e "${GREEN}Client dependencies already installed.${NC}"
fi

# Check for node_modules in mock server
if [ ! -d "server/mock/node_modules" ]; then
    echo -e "${GREEN}Installing server/mock dependencies...${NC}"
    cd server/mock && npm install && cd ..
else
    echo -e "${GREEN}Server dependencies already installed.${NC}"
fi

echo -e "${BLUE}Launching Frontend and Mock Server...${NC}"

# Trap ctrl-c and call cleanup
trap "kill 0" EXIT

# Start both processes
(cd server/mock && npm start) & 
(cd client && npm run dev) &

# Keep the script running
wait
