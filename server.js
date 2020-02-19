// npm install --save-dev nodemon // restart ne menyre atomatike serverin
// pasi kena modigikur package.json shtojme npm run start:server
// npm install --save multer therasim nje librari ne server ku na lejon qe te regjistrojme ne database edhe foto nga file x ne px na application ne server pastaj ne database (mongodb).
// npm run start:server

// tR6aMl5EOHHcVFcN ip adres ( 79.106.209.22)

const app = require("./backend/app"); // require te ndimon per te inportuar nje librari
const debug = require("debug")("node-angular");// nje file, nje funksione.
const http = require("http");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// kontrollojme nese ka error nodejs server
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000"); // ndertojme porten 3000
app.set("port", port);

// createServer function it will execute for every incoming request no matter which path this request targets it's targeting your domain or your IP, then this function here will be executed.
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port); // listen port i jep return portes 3000 per tu hapur ne localhost 3000, gjithashtu start the server, dhe krijon dhe port gjithashtu

