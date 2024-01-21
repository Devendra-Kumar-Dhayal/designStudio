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
            kubeconfig(credentialsId: '4ec4c6e5-71f4-4e4f-9533-c47800d985cc', serverUrl: 'https://kubernetes.default:443') {
    // some block
                kubernetesDeploy(configs: "./deployment/client/client-deployment.yaml", 
                                         "./deployment/server/server-deployment.yaml")
            }
          
        }
      }
    }
     
    
    
        
    
}

