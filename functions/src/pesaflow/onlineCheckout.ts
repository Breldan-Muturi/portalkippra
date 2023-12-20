import type {Request, Response} from "express";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import {createHmac} from "crypto";

export async function onlineCheckout(req: Request, res: Response) {
  const url = "https://test.pesaflow.com/PaymentAPI/iframev2.1.php";
  const serviceID = "48798";
  const apiClientID = "133";
  const amount = "1";
  const clientIDNumber = "11111111";
  const currency = "KES";
  const billRefNumber = "SUP_3361";
  const billDesc = "Some bill description";
  const clientName = "John Doe";
  const secret = "XV7N7p2fh9GPKf4Wv2RE3S1T0Vrv44dj";

  const dataString =
    apiClientID +
    amount +
    serviceID +
    clientIDNumber +
    currency +
    billRefNumber +
    billDesc +
    clientName +
    secret;

  const key = "dTaI5iILm82p5Frc";

  const hmacHash = (key: string, dataString: string) => {
    let hmac = createHmac("sha256", key);
    let signed = hmac.update(Buffer.from(dataString, "utf-8")).digest("hex");
    return signed;
  };

  const secureHash = hmacHash(key, dataString);

  axios({
    method: "POST",
    url,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      "secureHash":
        "ZTllODg5MjMwNGNlNWZjOTRjNDI2ZmZmODA4OTJhNWM5NjM3Mzc3YjYzYzhhNDM4ZTUyYjMxZDJhNGVjMzA2MQ==",
      "apiClientID": apiClientID,
      "serviceID": serviceID,
      "notificationURL":
        "https://webhook.site/bfb17e79-a804-4fd9-9478-e9ad80cb8111",
      "callBackURLOnSuccess": "google.com",
      "billRefNumber": billRefNumber,
      "sendSTK": true,
      "pictueURL": null,
      "format": "json",
      "currency": currency,
      "amountExpected": amount,
      "billDesc": billDesc,
      "clientMSISDN": "25472",
      "clientIDNumber": clientIDNumber,
      "clientEmail": "john.doe@example.com",
      "clientName": clientName,
    },
  })
    .then((response: any) => {
      logger.info("secureHash:", secureHash);
      res.status(200).json(response.data);
      if (
        response.data.status === 422 &&
        response.data.message === "Invoice already paid"
      ) {
        return res.status(422).json(response.data);
      } else {
        return res.status(200).json(response.data);
      }
    })
    .catch((error: any) => {
      logger.error(error);
      logger.info("secureHash:", secureHash);
      res.status(401).json({error});
    });
}
