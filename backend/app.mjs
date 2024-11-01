// Import necessary modules
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import roomState from "./docs/socket.mjs";
import comments from "./docs/comments.mjs";
import mongoDocs from './docs/remoteDocs.mjs';

import authRoutes, {authenticateToken} from "./routes/auth_user.mjs";


// GAPHQL
import { graphqlHTTP } from 'express-graphql';

// SET IT TO FALSE ONDER PRODUCTION!
const visual = process.env.VISUAL; 

import {GraphQLSchema} from "graphql";
import RootQueryType from "./graphql/root.mjs";
import RootMutationType from './graphql/root_mutation.mjs';

// Set up the Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST"],
  },
});
// Define roomTimeouts at the top level
const roomTimeouts = {}; // To hold timeout IDs for each room

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static(path.join(process.cwd(), "public"))); // Serve static files
app.use(morgan('combined')); // Log requests in the Apache style

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("create", async (room) => {
    if (!room) {
      console.error("Room ID is undefined");
      return; // Avoid proceeding if room is not defined
    }
    await socket.join(room);
    console.log(`Client ${socket.id} joined room: ${room}`);
    socket.currentRoom = room;

    try {
      const docComments = await comments.getComments(room);
      socket.emit("newComment", docComments);

      const data = await roomState.getRoomState(room);
      if (data) {
        socket.emit("socketJoin", data);
      }

      // Set room timeout
      roomTimeouts[room] = setTimeout(async () => {
        await roomState.clearRoomState(room);
        delete roomTimeouts[room];
      }, 300000); // 5 minutes
    } catch (error) {
      console.error("Error in create event:", error);
    }
  });

  // Handle document updates from clients
  socket.on("documentUpdate", (data) => {
    // Broadcast the updated title and content to other clients in the room
    socket.to(socket.currentRoom).emit("documentUpdate", data);
  });

  socket.on("comment", (data) => {
    comments.addComment(socket.currentRoom, data.comment, data.caretPosition.caret, data.caretPosition.line);
    socket.to(socket.currentRoom).emit("newComment", data);
  });

  socket.on("disconnect", async () => {
    console.log("Client disconnected:", socket.id);
    if (socket.currentRoom) {
      const users = io.sockets.adapter.rooms.get(socket.currentRoom);
      if (!users || users.size === 0) {
        await roomState.clearRoomState(socket.currentRoom);
        delete roomTimeouts[socket.currentRoom];
      }
    }
  });
});

// Parse application/json
app.use(bodyParser.json());

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

app.use('/auth', authRoutes); // Use auth routes under '/auth'

// FOR GRAPHQL: import in the begint
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType   
});

//use authentication in the users request
app.use('/graphql', authenticateToken, (req, res, next) => {// PRODUCTION MODE
    next();
}, graphqlHTTP({
  schema: schema,
  graphiql: visual, // Visual är satt till true under utveckling
  livereload: true, // watch code chenges
  customFormatErrorFn: (error) => {
    // Customize error response
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
      // Add any additional custom fields if necessary
    };
  },
}));

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    "errors": [
      {
        "status": err.status,
        "title": err.message,
        "detail": err.message
      }
    ]
  });
});

// Start the server
const port = process.env.NODE_ENV === 'test' ? process.env.TEST_PORT : process.env.PORT;
const server = httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// Export the app and server
export { app, server };
