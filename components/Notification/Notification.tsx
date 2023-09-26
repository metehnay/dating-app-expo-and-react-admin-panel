import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { firebaseApp, db } from "../../firebaseConfig";

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<Array<any>>([]);

  useEffect(() => {
    const loggedInUserId = firebaseApp.auth().currentUser?.uid;
    if (!loggedInUserId) {
      console.error("No logged-in user found!");
      return;
    }

    const fetchUserNameAndImage = async (userId: string) => {
      const userDoc = await db.collection("users").doc(userId).get();
      const userData = userDoc.data();
      return {
        name: userData?.fullName || "Bilinmeyen bir üye",
        imageUrl: userData?.imageUrl || "default_image_url",
      };
    };

    const userNotificationRef = db
      .collection("notifications")
      .where("userId", "==", loggedInUserId);

    const unsubscribe = userNotificationRef.onSnapshot(async (snapshot) => {
      const fetchedNotifications = [];
      for (let doc of snapshot.docs) {
        const data = doc.data();
        const userInfo = await fetchUserNameAndImage(data.fromUserId);
        data.fromName = userInfo.name;
        data.imageUrl = userInfo.imageUrl;
        fetchedNotifications.push(data);

        // If the notification type is "coffee", then add a "viewed" notification right after
        if (data.type === "coffee") {
          const viewedNotification = {
            ...data, // copying previous notification details
            type: "viewed",
          };
          fetchedNotifications.push(viewedNotification);
        }
      }
      setNotifications(fetchedNotifications);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {notifications.map((notification, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.notificationRow}>
            <Image
              source={{ uri: notification.imageUrl }}
              style={styles.avatar}
            />
            <View style={styles.notificationTextContainer}>
              {notification.type === "like" && (
                <Text style={styles.text}>
                  {notification.fromName}{" "}
                  <Text style={styles.emphasis}>sana beğeni gönderdi.</Text>
                </Text>
              )}
              {notification.type === "coffee" && (
                <Text style={styles.text}>
                  {notification.fromName}{" "}
                  <Text style={styles.emphasisCoffee}>
                    sana bir kahve gönderdi!
                  </Text>
                </Text>
              )}
              {notification.type === "star" && (
                <Text style={styles.text}>
                  {notification.fromName}{" "}
                  <Text style={styles.emphasisStar}>
                    sana bir yıldızlı beğen gönderdi!
                  </Text>
                </Text>
              )}
              {notification.type === "viewed" && (
                <Text style={styles.text}>
                  {notification.fromName}{" "}
                  <Text style={styles.emphasis5}>profilini görüntüledi.</Text>
                </Text>
              )}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // Makes it circular
    marginRight: 10,
  },
  notificationTextContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  emphasis: {
    fontWeight: "bold",
    color: "#FF4500", // default color for like
  },
  emphasis5: {
    color: "gray",
    fontWeight: "bold",
  },
  emphasisCoffee: {
    fontWeight: "bold",
    color: "#A0522D", // brown for coffee
  },
  emphasisStar: {
    fontWeight: "bold",
    color: "#800080", // purple for star
  },
});

export default NotificationScreen;
