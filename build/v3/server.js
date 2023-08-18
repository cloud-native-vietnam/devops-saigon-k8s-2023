const http = require('http');
const url = require("url");

const version=3;
const port=8081
// delay readiness in seconds
const readinessProbeDelay=5

// global state
var requests=0;
var startTime;
var host;
var ready;
var up;
var nodeName

var timeDelta = function(startTime) {
  return (new Date() - startTime)/1000;
}

var respond = function(res, code, message) {
  res.setHeader('Content-Type', 'text/plain');
  res.writeHead(code);
  res.end(`${message}\n`);
}

var log = function(message) {
  console.log(`v=${version} | Host: ${host} | ${message} | Node: ${nodeName} | App Uptime: ${timeDelta(startTime)} seconds | Log Time: ${new Date()}`);
}

// handlers
var handleDefault = function(_req, res) {
  respond(res, 200, `Hello DevOps Saigon! 👋 | Host: ${host} | Node: ${nodeName} | v=${version}`);
  log(`Default           | Total Requests: ${++requests}`);
}

var handleLivenessCheck = function(_req, res) {
  if(up){
    respond(res, 200, `OK`);
  } else {
    respond(res, 500, `Down`);
  }
  log(`Liveness Check    | Up: ${up}   `);
}

var handleReadinessCheck = function(_req, res) {
  if(ready) {
    respond(res, 200, `OK`);
  } else {
    respond(res, 500, `Not ready`);
  }
  log(`Readiness Check   | Ready: ${ready}`);
}

var handleStop = function(_req, res) {
  respond(res, 200, `Terminating 😵`);
  process.statusCode = 0;
  www.close(() => {
      log("Process terminated");
  });
}

var handleUp = function(_req, res, value) {
  up = value
  if(value) {
    respond(res, 200, `I'm up 😎`);
  }else {
    respond(res, 200, `I'm down 😵`);
  }
  log(`Command processed | Up: ${up}    `);
}

var handleReady = function(_req, res, value) {
  ready = value
  if(value) {
    respond(res, 200, `I'm ready 😃`);
  }else {
    respond(res, 200, `I'm not ready 😢`);
  }
  log(`Command processed | Ready: ${ready}`);
}

var www = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url).pathname
  // console.log(`Router: ${reqUrl}`)
  switch(reqUrl) {
    case "/health-check/liveness":
      handleLivenessCheck(req, res)
      break;
    case "/health-check/readiness":
      handleReadinessCheck(req, res)
      break;
    case "/up":
      handleUp(req, res, true)
      break;
    case "/down":
      handleUp(req, res, false)
      break;
    case "/ready":
      handleReady(req, res, true)
      break;
    case "/unready":
      handleReady(req, res, false)
      break;
    case "/stop":
      handleStop(req, res)
      break;
    default:
      handleDefault(req, res)
  }
});

www.listen(port, function () {
  up = true
  ready = false
  // simulate readiness probe delay
  seconds = readinessProbeDelay.toString().padStart(2, "0")
  setTimeout(() => {
    log(`Waited ${seconds}s        | Ready: ${ready}`);
    ready = true
  }, readinessProbeDelay*1000)
  startTime = new Date();
  host = process.env.HOSTNAME.slice(-5);
  // Using kubernetes downward API to get NODE_NAME through ENV
  nodeName = process.env.NODE_NAME.padEnd(12, " ");
  log(`Kubernetes Bootcamp App Started At ${startTime} port: ${port}`)
});


/**
 * Simulate graceful shutdown on SIGTERM
 * refs:
 *  - https://gist.github.com/hyrious/30a878f6e6a057f09db87638567cb11a
 *  - https://help.heroku.com/ROG3H81R/why-does-sigterm-handling-not-work-correctly-in-nodejs-with-npm
 */
process.on("SIGTERM", async () => {
  process.statusCode = 0;
  log("SIGTERM received ");
  setTimeout(() => {
      log('Waited 5s         | Exiting');
      www.close(() => {
        log(`Process terminated`);
    });
    process.exit(0);
  }, 5000).unref();
});
