first apply the jenkeins namespace file in the root folder and then apply all 
files  in the jenkins folder


or 

run these commands 

kubectl create ns jenkins

kubectl -n jenkins apply -f ./jenkins/ # for windows change the / to \

kubectl get pods -n jenkins

kubectl -n jenkins logs <jenkins-deployment> # there will be password in a singleline of the #formm

89fece00efd6453caca6956cffa090d4


kubectl -n jenkins port-forward <jenkins-deployement> 8080


