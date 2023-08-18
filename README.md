# Kubernetes 101

[slides](./slides.pdf)

## Roll Out Demo

Recording:

[![Watch the video](https://img.youtube.com/vi/rHm1v6QsTkA/default.jpg)](https://youtu.be/rHm1v6QsTkA)

```sh
make build-all
make deploy-v1
make expose
NODE_PORT=$(kubectl get services/kubernetes-bootcamp -o json | jq '.spec.ports[0].nodePort')
while true;do curl $(minikube -p cluster ip):${NODE_PORT};sleep 1;done
```

```sh
kubectl scale deployments/kubernetes-bootcamp --replicas=2
make deploy-v2
make deploy-v3
```

```sh
# deploy kubeview for graph visualization
kubectl apply -f kubeview
minikube -p cluster service -n kubeview kubeview
# terminal tracing
kubespy trace deploy kubernetes-bootcamp
```

## Set up

Multi node minikube cluster with local registry

requires docker (using [orbstack](https://orbstack.dev/) for MacOS), [docker-buildx](https://github.com/docker/buildx/releases) and Minikube

```sh
minikube -p cluster start --nodes 2 --insecure-registry "10.0.0.0/24"
minikube -p cluster addons enable metrics-server
minikube -p cluster addons enable dashboard
minikube -p cluster addons enable registry
docker run --rm -it --network=host alpine ash -c "apk add socat && socat TCP-LISTEN:5000,reuseaddr,fork TCP:$(minikube -p cluster ip):5000" &
```

## References

- [minikube](https://minikube.sigs.k8s.io/docs/start/)
- [hello-minikube](https://kubernetes.io/docs/tutorials/hello-minikube/)
- [Kubernetes 101](https://minikube.sigs.k8s.io/docs/tutorials/kubernetes_101/)
- [Skaffold](https://skaffold.dev/docs/quickstart/)

## Advanced Minikube config

- [minikube multi-node](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/)
- [Local registry for multi-node](https://minikube.sigs.k8s.io/docs/handbook/registry/#enabling-insecure-registries)
- [Ingress DNS](https://minikube.sigs.k8s.io/docs/handbook/addons/ingress-dns/)

## Rolling update demo

- [benc-uk/KubeView](https://github.com/benc-uk/kubeview/tree/master/charts)
- [GKE Rolling Update](https://github.com/GoogleCloudPlatform/gke-rolling-updates-demo)
- [Kubernetes Downward API](https://kubernetes.io/docs/concepts/workloads/pods/downward-api/)

Tools:

- [kubespy](https://github.com/pulumi/kubespy)
- [stern](https://github.com/stern/stern)
- [jq](https://stedolan.github.io/jq/)
- [tmux](https://tmuxcheatsheet.com/)

resize pane on MacOS - `ctrl+b :`

```
resize-pane -U <amount-up>
resize-pane -D <amount-down>
resize-pane -L <amount-left>
resize-pane -R <amount-right>
```
