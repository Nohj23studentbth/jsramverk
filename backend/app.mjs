import 'dotenv/config';
import express from 'express';
// import { json, urlencoded } from 'body-parser';
// import { join } from 'path';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
import auth from "./routes/auth_user.mjs";
import users from "./routes/users.mjs";
//import data from "./routes/data.mjs";
import data from './routes/mongoRemote.mjs';

//import { checkAPIKey } from "./models/auth.js";
import authModels from "./models/auth.mjs";
let port = process.env.NODE_ENV === 'test'? process.env.TEST_PORT : process.env.PORT;

app.use(cors()); // tillåter nå app från olika platformer. Det finns mäjlighet att presissera varifån appen can nås

//const allowedOrigins = ['http://localhost:3001'];

// Parse application/json
app.use(bodyParser.json());

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.json()); // in plase of bodyParser.urlencoded and bodyParser.json

// // Middleware to override the method
// app.use(methodOverride('_method'));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// app.all('*', authModels.checkAPIKey);

//app.use("/users", users);
app.use("/data", data);
app.use("/auth", auth);
// app.use('/hoy', async (reg, res) =>{
//   res.send("HOY Hoppolapoy!");
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
    console.log('auth api listening on port ' + port);
});

export default server;
