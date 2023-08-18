const k8s = require('@kubernetes/client-node');
var kc

const getPodIp = async (k8sApi, namespace, host) => {
  try {
    var regex = new RegExp( `${host}$`, 'g' );
    const podsRes = await k8sApi.listNamespacedPod(namespace);
    if(podsRes.body.items.length > 0) {
      let filteredPods = podsRes.body.items.filter((pod) => {
        return pod.metadata.name.match(regex);
      });
      if(filteredPods.length > 0) {
        console.log(`First pod found: ${filteredPods[0].metadata.name} (${filteredPods[0].status.podIP})`);
        return filteredPods[0].status.podIP;
      }else {
        console.log(`No pods found matching ${host} in ${namespace}`);
      }
    } else {
      console.log(`No pods found in ${namespace}`);
    }
  } catch (err) {
      console.error(err);
      process.exit(1);
  }
}

const curl = async (host, port, query) => {
  try {
    const resource = `http://${host}:${port}${query}`;
    console.log(`curl ${resource}`);
    return await fetch(resource, {
      signal: AbortSignal.timeout(1000)
    })
      .then((res) => res.text())
  } catch (err) {
      console.error(err);
      process.exit(1);
  }
}

const main = async () => {
  if(process.argv.length < 4) {
    console.log(`Usage: node index.js <host> <query> [port=8081]`);
    console.log(`Queries: /up, /down, /ready, /unready, /stop`);
    process.exit(1);
  }
  const host = process.argv[2];
  const query = process.argv[3];
  const port = process.argv[4] ?? 8081;

  kc = new k8s.KubeConfig();
  kc.loadFromCluster();
  const context = kc.getContextObject(kc.currentContext);
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

  const podIp = await getPodIp(k8sApi, context.namespace, host);
  result = await curl(podIp, port, query);
  console.log(`${host}: ${result}`);
};

main();
