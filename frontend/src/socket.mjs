import { io } from 'socket.io-client';
const NODE_ENV = 'production';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production"
      ? "https://jsramverk-oleg22-g9exhtecg0d2cda5.northeurope-01.azurewebsites.net/"
      : "http://localhost:3000";

export const socket = io(URL, {
    autoConnect: false
  });