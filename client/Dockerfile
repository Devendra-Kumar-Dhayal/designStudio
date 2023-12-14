# Base image
FROM node:20-alpine

# Set working directory\
RUN mkdir /frontend   
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# # Build the app
# RUN npm run build

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
