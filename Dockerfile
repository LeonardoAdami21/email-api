# Use the official Node.js 14 image as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the NestJS application will run on
EXPOSE ${APP_PORT}

# Set environment variables for NestJS
ENV APP_PORT=${APP_PORT}


# Build the application
RUN yarn prisma migrate dev && yarn build

# Start the NestJS application
CMD ["yarn", "start:dev"]