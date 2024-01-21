node('jenkins-slave') {

    stage('gitclone pipeline') {
        
    // some block
            sh(script: """
            
            echo "hello"
            rm -rf ./designStudio
            git clone https://github.com/Devendra-Kumar-Dhayal/designStudio.git
            cd ./designStudio/
            
           
           
        """)
        
        
        
    }
    
    stage('Deploying React.js container to Kubernetes') {
      steps {
        script {
          kubernetesDeploy(configs: "./deployment/client/client-deployment.yaml", 
                                         "./deployment/server/server-deployment.yaml")
        }
      }
    }
     
    
    
        
    
}

