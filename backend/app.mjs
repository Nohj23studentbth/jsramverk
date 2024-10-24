import 'dotenv/config';

let port = process.env.NODE_ENV === 'test'? process.env.TEST_PORT : process.env.PORT;

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';


import mongoRemote from "./routes/mongoRemote.mjs";
import authRoutes from "./routes/auth_user.mjs";

// GAPHQL
import { graphqlHTTP } from 'express-graphql';
const visual = true; // SET IT TO FALSE ONDER PRODUCTION!
import {GraphQLSchema} from "graphql";

import RootQueryType from "./graphql/root.mjs";
//import users from "./models/users.mjs"

const app = express();
const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   autoConnect: false,
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "DELETE", "PUT"],
//   }
// });
const io = new Server(httpServer, {
  autoConnect: false,
  cors: {
    origin: "http://localhost:3000", // Adjust based on where your frontend runs
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true, // ALLOW COOKIES
  }
});

io.on('connection', function(socket) {
    console.log(socket.id);
    // socket.on("content", function (data) {
    //     console.log(data);

    //     io.emit("content", data);

    //     // Spara till databas och göra annat med data
    // });
})

const corsOptions = {
  origin: 'http://localhost:3000', // Frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies to be included
};

app.use(cors(corsOptions)); // tillåter nå app från olika platformer. Det finns mäjlighet att presissera varifån appen can nås
app.use(cookieParser());
// // Parse application/json
// app.use(bodyParser.json());

app.disable('x-powered-by');

app.set("view engine", "ejs");

// middelwear showing working route
app.use((req, res, next) => {
  console.log(req.method);
  console.log(req.path);
  next();
});

app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.json()); // in plase of bodyParser.urlencoded and bodyParser.json

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

//app.get("/", (req, res) => users.getAll(res));
app.use('/data', mongoRemote); // import routes using remote mongoDB
app.use('/auth', authRoutes); // Use auth routes under '/auth'

// FOR GRAPHQL
const schema = new GraphQLSchema({
  query: RootQueryType
});
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: visual, // Visual är satt till true under utveckling
}));

// // Protect the documents route
// app.get('/documents', authenticateToken, async (req, res) => {
//   const documents = await Document.find(); // Make sure you define Document schema properly
//   res.json(documents);
// });

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
      return next(err);
  }

  res.status(err.status || 500).json({
      "errors": [
          {
              "status": err.status,
              "title":  err.message,
              "detail": err.message
          }
      ]
  });
});
const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});


// ES module-style code (Correct)
export { app, server};


