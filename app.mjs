// import React from 'react';
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);

import 'dotenv';
import 'dotenv/config';

const port = process.env.PORT || 3000; // Default to 3000 if PORT is undefined

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan'; // logging med tredjepart modules
import methodOverride from 'method-override';

import posts from "./routes/sql.mjs";
//import mongoLocal from "./routes/mongo.mjs";
import mongoRemote from "./routes/mongoRemote.mjs";

const app = express();

//app.use(cors()); // tillåter nå app från olika platformer. Det finns mäjlighet att presissera varifån appen can nås

// Parse application/json
app.use(bodyParser.json());

app.disable('x-powered-by');

app.set("view engine", "ejs");

// // Set the new views directory
// app.set("views", path.join(process.cwd(), "init-views")); // Updated line

// middelwear showing working route
app.use((req, res, next) => {
  console.log(req.method);
  console.log(req.path);
  next();
});

app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.json()); // in plase of bodyParser.urlencoded and bodyParser.json
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Middleware to override the method
app.use(methodOverride('_method'));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/posts', posts); // import routes from the first moment that use SQLite
//app.use('/mongo', mongoLocal); // import routes using local mongoDB
app.use('/rm', mongoRemote); // import routes using remote mongoDB

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
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
