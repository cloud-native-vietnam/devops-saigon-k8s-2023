SHELL = /bin/sh

v%: v%/server.js Dockerfile
	@cp Dockerfile $@/
	@docker build --push -t localhost:5000/kubernetes-bootcamp:$@ $@/
	@rm $@/Dockerfile

util: util/index.js util/Dockerfile
	@docker build --push -t localhost:5000/util:v1 util/
