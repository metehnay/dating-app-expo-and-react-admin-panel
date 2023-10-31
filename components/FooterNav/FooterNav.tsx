import React, { useState, useEffect } from "react";
import {
  View,
  Pressable,
  Text,
  Modal,
  Image,
  Button,
  StyleSheet,
} from "react-native";
import { styles as existingStyles } from "./style";
import SVGComponent from "./../SVGComponent";
import { firebaseApp } from "../../firebaseConfig";
import ReusableModal from "./../VIPModal/VIPModal";
import { useTranslation } from "../../TranslationContext";

const FooterNav = ({ navigationRef }: any) => {
  const [activeRoute, setActiveRoute] = useState("");
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const i18n = useTranslation();

  useEffect(() => {
    const user = firebaseApp.auth().currentUser;
    if (user) {
      const messagesRef = firebaseApp
        .firestore()
        .collection("messages")
        .where("receiverId", "==", user.uid)
        .where("unread", "==", true);

      const messagesUnsubscribe = messagesRef.onSnapshot((snapshot) => {
        setUnreadMessagesCount(snapshot.size);
      });

      const userRef = firebaseApp.firestore().collection("users").doc(user.uid);
      userRef.get().then((doc) => {
        if (doc.exists) {
          setUserData(doc.data());
        }
      });

      return () => {
        messagesUnsubscribe();
      };
    }
  }, []);

const handleNavigation = (route: string) => {


  navigationRef.current?.navigate(route);
  setActiveRoute(route);
};
  const navItems = [
    { route: "Homepage", icon: "mood", displayName: "Match" },
    {
      route: "NotificationScreen",
      icon: "notify",
      displayName: "Notification",
    },

    {
      route: "PremiumScreen",
      icon: "shop",
      customSize: 40,
    },
    {
      route: "ConversationsList",
      icon: "favorites",
      displayName: i18n.t("myMessages"),
      customSize: 25,
    },
    { route: "Profile", icon: "profile", displayName: i18n.t("profileScreen") },
  ];

  return (
    <View style={existingStyles.footer}>
      <ReusableModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
          navigationRef.current?.navigate("JetonScreen");
        }}
        iconName="vip1"
        message={i18n.t("getVipMessage")}
        buttonText={i18n.t("okConfirm")}
      />
      <View style={existingStyles.row}>
        {navItems.map((item, index) => (
          <View
            key={item.route}
            style={[
              existingStyles.pressable,
              { alignItems: "center", width: 80 },
            ]}
          >
            <Pressable
              onPress={() => handleNavigation(item.route)}
              style={{ alignItems: "center" }}
            >
              {item.route === "ConversationsList" &&
                unreadMessagesCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadMessagesCount}</Text>
                  </View>
                )}
              <SVGComponent
                iconName={item.icon}
                customWidth={item.customSize || 24}
                customHeight={item.customSize || 24}
                color={activeRoute === item.route ? "#2cc1d7" : "#101010"}
              />
              {activeRoute === item.route && (
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 9,
                    color: activeRoute === item.route ? "#2cc1d7" : "#101010",
                    fontWeight: activeRoute === item.route ? "bold" : "normal",
                  }}
                >
                  {item.displayName}
                </Text>
              )}
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default FooterNav;
