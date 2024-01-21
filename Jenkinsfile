node('jenkins-slave') {
    
     stage('test pipeline') {
        sh(script: """
            
            echo "hello"
            git clone https://github.com/Devendra-Kumar-Dhayal/designStudio.git
            cd ./designStudio/
            kubectl apply -f ./deployment/client/ -n jenkins

            kubectl apply -f ./deployment/server/ -n jenkins
           
           
        """)
    }
}