# Base image
FROM node:20-alpine

# Set working directory\
RUN mkdir /app   
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn
# Run npm install 

# Copy app files
COPY . .

# # Build the app
# RUN npm run build

# Expose the port
EXPOSE 5000

# Start the app
CMD ["npm", "run","dev"]