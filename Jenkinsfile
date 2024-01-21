pipeline {
  environment {
    dockerimagename = "nevdread/client"
    dockerImage = ""
  }
  agent any
  stages {
    stage('Checkout Source') {
      steps {
        git 'https://github.com/Devendra-Kumar-Dhayal/designStudio.git'
      }
    }
    
    stage('Deploying React.js container to Kubernetes') {
      steps {
        script {
          kubernetesDeploy(configs: "deployment.yaml")
        }
      }
    }
  }
}
