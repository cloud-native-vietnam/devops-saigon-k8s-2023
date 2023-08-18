var http = require('http');
var requests=0;
var startTime;
var host;
var version=1;

var handleRequest = function(_req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.writeHead(200);
  res.write("Hello DevOps Saigon! ");
  res.write(`| Host: ${host.slice(-5)} `);
  res.end(`| v=${version}\n`);
  console.log(`Hostname: ${host} | Total Requests: ${++requests} | App Uptime: ${(new Date() - startTime)/1000} seconds | Log Time: ${new Date()}`);
}
var www = http.createServer(handleRequest);

www.listen(8081,function () {
    startTime = new Date();;
    host = process.env.HOSTNAME;
    console.log ("Kubernetes Bootcamp App v1 Started At:",startTime, "| Running On: " ,host, "\n" );
});

process.on("SIGTERM", async () => {
  process.statusCode = 0;
  console.log("SIGTERM received ");
    www.close(() => {
      console.log(`Process terminated`);
  });
});
