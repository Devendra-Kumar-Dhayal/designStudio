pipeline {
  environment {
    dockerimagename = "nevdread/client"
    dockerImage = ""
  }
  agent any
  
    
    stage('Deploying React.js container to Kubernetes') {
      steps {
        script {
          kubernetesDeploy(configs: "deployment.yaml")
        }
      }
    }
}

