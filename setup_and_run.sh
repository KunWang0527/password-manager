#!/bin/bash

# Change directory to Backend and install dependencies
cd Backend/
npm install

# Start the server
node server.js

# Move back to the parent directory
cd ..

# Change directory to frontend and install dependencies
cd frontend/
npm install yarn
yarn install

# Start the frontend application
npm start
