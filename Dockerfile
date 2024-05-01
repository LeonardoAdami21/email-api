# Use the official Node.js 14 image as the base image
FROM node:20.11.1

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the NestJS application will run on
EXPOSE 3000

# Set environment variables for NestJS
ENV NODE_ENV=${NODE_ENV}
ENV APP_PORT=${APP_PORT}
ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_USERNAME=${DATABASE_USERNAME}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_NAME=${DATABASE_NAME}

# Build the application
RUN yarn prisma migrate dev && yarn build

# Start the NestJS application
CMD ["node", "/dist/main"]