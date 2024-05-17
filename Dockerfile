# Use the official Node.js image as the base image
FROM --platform=linux/amd64 node:18-alpine

# Install Python and other dependencies
RUN apk add --no-cache python3 make g++

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

#COPY entrypoint.sh /usr/src/app/
RUN chmod +x /usr/src/app/entrypoint.sh

# Set the entry point command
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
