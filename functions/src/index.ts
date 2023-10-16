import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios"; // Use axios or another HTTP client

admin.initializeApp();

export const sendNotification = functions.https.onCall(
  async (
    data: { receiverId: string; message: string },
    context: functions.https.CallableContext
  ) => {
    const { receiverId, message } = data;

    // Ensure senderId is available
    const senderId = context.auth?.uid;
    if (!senderId) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Authentication failed. Sender ID is unavailable."
      );
    }

    const senderSnapshot = await admin
      .firestore()
      .collection("users")
      .doc(senderId)
      .get();
    const senderData = senderSnapshot.data();

    if (!senderData) {
      throw new functions.https.HttpsError(
        "not-found",
        "Sender data not found."
      );
    }

    const senderName = senderData.fullName || "New Message!";
    const senderImage = senderData.imageUrl || null;

    // Continue with the previous receiver token fetching code...
    const userSnapshot = await admin
      .firestore()
      .collection("users")
      .doc(receiverId)
      .get();
    const userData = userSnapshot.data();

    if (userData && userData.expoPushToken) {
      const expoPushToken = userData.expoPushToken;

      // Modify the push payload
      const response = await axios.post(
        "https://exp.host/--/api/v2/push/send",
        {
          to: expoPushToken,
          title: senderName,
          body: message,
          sound: "default",
          data: {
            image: senderImage,
            action: "go_to_home",
          },
          image: senderImage,
        }
      );

      if (response.data.errors && response.data.errors.length > 0) {
        throw new functions.https.HttpsError(
          "internal",
          "Failed to send the notification via Expo."
        );
      }

      return { data: "Notification sent!" };
    } else {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The receiver does not have a valid push token."
      );
    }
  }
);

