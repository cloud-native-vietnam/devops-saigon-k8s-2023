v%: v%.yaml
	@echo deploying version $@
	@kubectl apply -f $@.yaml

expose: svc.yaml
	@echo exposing app
	@kubectl apply -f svc.yaml
	@kubectl get services/kubernetes-bootcamp -o json | jq '.spec.ports[0].nodePort'

host-%:
	@kubectl apply -f sa-util.yaml > /dev/null
	@kubectl create job $* --image localhost:5000/util:v1 --dry-run=client -o json \
		| jq '.spec.backoffLimit |= 0' \
		| jq '.spec.template.spec.containers[0].args |= ["$(host)", "/$*"]' \
		| jq '.spec.template.spec.containers[0].imagePullPolicy |= "Always"' \
		| jq '.spec.template.spec.serviceAccountName |="util"' \
		| kubectl apply -f -
	@echo "waiting for job to complete	(10s) ..."
	@-kubectl wait --for=condition=complete --timeout=10s job/$*
	@echo "logs:"
	@kubectl logs job/$*
	@kubectl delete job/$* > /dev/null

clean:
	@-kubectl delete -f v1.yaml
	@-kubectl delete -f v2.yaml
	@-kubectl delete -f v3.yaml
	@-kubectl delete -f svc.yaml
	@-kubectl delete -f sa-util.yaml
