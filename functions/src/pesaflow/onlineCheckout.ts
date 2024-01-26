import type {Request, Response} from "express";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import {createHmac} from "crypto";
import {ConversionUtils} from "turbocommons-ts";

export async function onlineCheckout(req: Request, res: Response) {
  const {
    body: {
      url,
      serviceID,
      apiClientID,
      secret,
      amountExpected,
      clientIDNumber,
      currency,
      billRefNumber,
      billDesc,
      callBackURLOnSuccess,
      clientName,
      pictureURL,
      sendSTK,
      clientMSISDN,
      clientEmail,
      key,
      format,
      notificationURL,
    },
  } = req;
  logger.debug("Request body: ", req.body);
  // const amountExpected: "1"
  // const apiClientID: "133"
  // const billDesc: "Some bill description"
  // const billRefNumber: "SUP_3361"
  // const callBackURLOnSuccess: "google.com"
  // const clientIDNumber: "11111111"
  // const clientMSISDN: "25472"
  // const clientName: "John Doe"
  // const currency: "KES"
  // const format: "json"
  // const key: "dTaI5iILm82p5Frc"
  // const notificationURL =
  //   "https://webhook.site/bfb17e79-a804-4fd9-9478-e9ad80cb8111";
  // const secret: "XV7N7p2fh9GPKf4Wv2RE3S1T0Vrv44dj";
  // const sendSTK: true;
  // const serviceID: "48798";
  // const url: "https://test.pesaflow.com/PaymentAPI/iframev2.1.php";
  // const pictureURL: null;
  // const clientEmail: "john.doe@example.com";

  const dataString =
    apiClientID +
    amountExpected +
    serviceID +
    clientIDNumber +
    currency +
    billRefNumber +
    billDesc +
    clientName +
    secret;

  logger.debug("dataString: ", dataString);

  const hmacHash = (key: string, dataString: string) => {
    let hmac = createHmac("sha256", key);
    let signed = hmac.update(Buffer.from(dataString, "utf-8")).digest();
    let secureValue = ConversionUtils.stringToBase64(signed.toString("hex"));
    return secureValue;
  };

  const secureHash = hmacHash(key, dataString);
  logger.debug("secureHash: ", secureHash);

  axios({
    method: "POST",
    url,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      "secureHash": secureHash,
      "apiClientID": apiClientID,
      "serviceID": serviceID,
      "notificationURL": notificationURL,
      "callBackURLOnSuccess": callBackURLOnSuccess,
      "billRefNumber": billRefNumber,
      "sendSTK": sendSTK === "true",
      "pictueURL": pictureURL ?? null,
      "format": format,
      "currency": currency,
      "amountExpected": amountExpected,
      "billDesc": billDesc,
      "clientMSISDN": clientMSISDN,
      "clientIDNumber": clientIDNumber,
      "clientEmail": clientEmail,
      "clientName": clientName,
    },
  })
    .then((response: any) => {
      res.status(response.status).json(response.data);
    })
    .catch((error: any) => {
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || {error: "An unknown error occurred"});
    });
}
