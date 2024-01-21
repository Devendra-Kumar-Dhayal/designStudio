# Application Design Studio
![image](https://i.pinimg.com/originals/44/db/bd/44dbbd8d16d9f5a8f5492db8d9fbb132.png)

Web-based editor to model the individual data flows
between applications. Team of applications collaborating to make a business function smoothly 

# Inspiration 
The Data Flow Modeling Web Editor streamlines system understanding by providing an intuitive interface to visually model and document data flows between applications, enhancing collaboration and facilitating real-time communication for seamless integration and efficient project management.

# User Stories 
- Designer mode: to create, delete and modify flows
- Viewer mode: to visualise flows 

## Features

- Intuitive Interface
- Application Integration
- REST API Integration
- Scalability
- Security and Documentation

## Tech Stack
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E) ![Node.js](https://img.shields.io/badge/NodeJs-1572B6?style=for-the-badge&logo=nodejs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-323330?style=for-the-badge&logo=typescript&logoColor=F7DF1E) ![MongoDB](https://img.shields.io/badge/MongoDb-1572B6?style=for-the-badge&logo=mongodb&logoColor=white) ![Express](https://img.shields.io/badge/Express-1572B6?style=for-the-badge&logo=express&logoColor=white) ![React](https://img.shields.io/badge/React-1572B6?style=for-the-badge&logo=react&logoColor=white) ![Zod](https://img.shields.io/badge/Zod-1572B6?style=for-the-badge&logo=zod&logoColor=white) ![nextUi](https://img.shields.io/badge/nextUi-1572B6?style=for-the-badge&logo=nextui&logoColor=white) ![nextUi](https://img.shields.io/badge/mongoose-1572B6?style=for-the-badge&logo=mongoose&logoColor=white)

## Quick start

To setup using docker compose

```bash
  docker compose up --build --no-cache
```
to setup manually 
navigate to client folder;
```bash
  yarn 
  #or
  npm install --force
  npm start
  
```
navigate to server folder;
```bash
  yarn 
  #or
  npm install --force
  npm run dev
  
```
setup .env file using .env.example
at client side add .env.local
and for server side .env

# Deployment

We've utilized Jenkins for our CI/CD processes, and the deployment has been successfully completed on Kubernetes.

# Security

- Our application is fortified against risks such as XSS, ReDoS, and NoSQL injection by adopting best practices.
- Additionally, we've utilized Snyk, a developer security platform, to enhance and safeguard our application's security measures.




<a href="https://github.com/gitatractivo/designStudio/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=gitatractivo/designStudio" />
</a>