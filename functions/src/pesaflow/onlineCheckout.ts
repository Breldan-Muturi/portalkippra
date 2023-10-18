import type {Request, Response} from "express";
import * as logger from "firebase-functions/logger";
import axios from "axios";

export async function onlineCheckout(req: Request, res: Response) {
  const url = "https://test.pesaflow.com/PaymentAPI/iframev2.1.php";
  // const serviceID = 48674;
  // const apiClientID = "dTaI5iILm82p5Frc";
  // const amount = 1;
  // const clientIDNumber = 33398260;
  // const currency = "KES";
  // const billRefNumber = "breldansCourseInvoice";
  // const billDesc = "Course";
  // const clientName = "Breldan Muturi";
  // const secret = "XV7N7p2fh9GPKf4Wv2RE3S1T0Vrv44dj";
  // const secureHash = Buffer.from(
  //   apiClientID +
  //     amount +
  //     serviceID +
  //     clientIDNumber +
  //     currency +
  //     billRefNumber +
  //     billDesc +
  //     clientName +
  //     secret
  // ).toString("base64");

  axios({
    method: "POST",
    url,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      "apiClientID": "111",
      "serviceID": "48674",
      "billDesc": "Payment Of Req",
      "currency": "KES",
      "billRefNumber": "TEST0001",
      "clientMSISDN": "25472000000000",
      "clientName": "John Doe",
      "clientIDNumber": "00000000",
      "clientEmail": "abc@email.com",
      "callBackURLOnSuccess": "https://mycallback.com",
      "amountExpected": "1000",
      "notificationURL": "https://example.com",
      "secureHash":
        "qqLjYEt3Kg2PiRiOyiKwwO17bYIsPd+Bsadfgsagdsdfdsgweweqcwqdwqer2hRS1Kr83rc=",
      "format": "json",
      "sendSTK": true,
      "pictureURL": "",
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
