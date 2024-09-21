import 'dotenv';
import 'dotenv/config';

const port = process.env.PORT || 3000; // Default to 3000 if PORT is undefined

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan'; // logging med tredjepart modules
import methodOverride from 'method-override';

import mongoRemote from "./routes/mongoRemote.mjs";

const app = express();

app.use(cors()); // tillåter nå app från olika platformer. Det finns mäjlighet att presissera varifån appen can nås

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

// Middleware to override the method
app.use(methodOverride('_method'));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

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
