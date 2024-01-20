first apply the jenkeins namespace file in the root folder and then apply all 
files  in the jenkins folder


or run these commands 

kubectl create ns jenkins

kubectl -n jenkins apply -f ./jenkins/ # for windows change the / to \

kubectl get pods -n jenkins

kubectl -n jenkins logs <jenkins-deployment>


kubectl -n jenkins port-forward <jenkins-deployement> 8080

53d8e83757df4e10998a23e23dc8b61e