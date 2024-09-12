// import React from 'react';
import 'dotenv';
import 'dotenv/config';

const port = process.env.PORT || 3006; // Default to 3006 if PORT is undefined

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan'; // logging med tredjepart modules
import methodOverride from 'method-override';

import sqlRoutes from "./routes/sql.mjs";
import jsonRoutes from "./routes/json.mjs";
import mongoRoutes from "./routes/mongo.mjs";

const app = express();


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

app.use('/', sqlRoutes); // import routes from the first moment
app.use('/json', jsonRoutes); // import json routes, routes will have url: localhose:3006/json/...
app.use('/mongo', mongoRoutes); // import routes using mongoDB

app.get("/jsonMongo", async(req, res) => {
  let dsn = `mongodb://localhost:27017/mummin`;
  let colname = `crowd`;
  const criteria2 = {
      namn: /^Sn/
  };
  const projection2 = {
      _id: 1,
      namn: 1
  };
  const limit2 = 3;
  try {
      const data = {
          docs: await documents.findInCollection(dsn, colname, criteria2, projection2, limit2)
      };
      res.json(data);
  } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
  };
});
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
