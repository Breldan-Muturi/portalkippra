import {onRequest} from "firebase-functions/v2/https";
import * as express from "express";
import {onlineCheckout} from "./pesaflow/onlineCheckout";

const app = express();
app.post("/onlinecheckout", onlineCheckout);

export const main = onRequest(
  {cors: true, maxInstances: 5, memory: "4GiB"},
  app
);
