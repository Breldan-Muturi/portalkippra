import type {Request, Response} from "express";
import * as logger from "firebase-functions/logger";
import axios from "axios";

export async function onlineCheckout(req: Request, res: Response) {
  const url = "https://test.pesaflow.com/PaymentAPI/iframev2.1.php";
  const serviceID = 48674;
  const apiClientID = "dTaI5iILm82p5Frc";
  const amount = 1;
  const clientIDNumber = 33398260;
  const currency = "KES";
  const billRefNumber = "breldansCourseInvoice";
  const billDesc = "Course";
  const clientName = "Breldan Muturi";
  const secret = "XV7N7p2fh9GPKf4Wv2RE3S1T0Vrv44dj";
  const secureHash = Buffer.from(
    apiClientID +
      amount +
      serviceID +
      clientIDNumber +
      currency +
      billRefNumber +
      billDesc +
      clientName +
      secret
  ).toString("base64");
  axios({
    method: "POST",
    url,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      "apiClientID": apiClientID,
      "serviceID": serviceID,
      "billDesc": billDesc,
      "currency": "KES",
      "billRefNumber": billRefNumber,
      "clientMSISDN": 254714866477,
      "clientName": clientName,
      "clientIDNumber": clientIDNumber,
      "clientEmail": "breldan@sohnandsol.com",
      "callBackURLOnSuccess": "",
      "amountExpected": amount,
      "notificationURL":
        "https://portal.kippra.or.ke/api/1.1/wf/instant_payment_notification",
      "secureHash": secureHash,
      "format": "json",
      "sendSTK": true,
      "PictureURL":
        "https://lh3.googleusercontent.com/a/AAcHTtfYFNuwQSf8QEEAbsE7dpPL6eCU131XTdw-GRo-Ai1UAw=s96-c-rg-br100",
    },
  })
    .then((response: any) => {
      res.status(200).json(response.data);
    })
    .catch((error: any) => {
      const message = (error as Error).message;
      logger.error("Error with pesaflow: ", message);
      res.status(401).json({
        message: message
          ? `"Error with pesaflow: ", ${message}`
          : "An error occurred",
      });
    });
}
