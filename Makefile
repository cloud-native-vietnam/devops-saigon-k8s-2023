SHELL = /bin/sh

setup:
	minikube -p cluster start --nodes 2 --insecure-registry "10.0.0.0/24"
	minikube -p cluster addons enable metrics-server
	minikube -p cluster addons enable dashboard
	minikube -p cluster addons enable registry
	docker run --rm -it --network=host alpine ash -c "apk add socat && socat TCP-LISTEN:5000,reuseaddr,fork TCP:$(minikube -p cluster ip):5000" &

clean:
	@make -C deploy clean

build-all:
	@make -C build v1
	@make -C build v2
	@make -C build v3

deploy-v%: build-all deploy/v%.yaml
	@make -C deploy v$*

# pass in host=<host-name> for the following targets
util:
	@make -C build util
up:
	@make -C deploy host-up
down:
	@make -C deploy host-down
ready:
	@make -C deploy host-ready
unready:
	@make -C deploy host-unready
stop:
	@make -C deploy host-stop

expose: deploy/svc.yaml
	@make -C deploy expose

.PHONY: setup build-all util up down ready unready stop
