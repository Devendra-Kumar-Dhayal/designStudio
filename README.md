

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