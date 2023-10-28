// Importing all necessary modules and components for this functionality.
import React, { useEffect, useState } from "react";
import {
  Platform,
  Text,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import Purchases, { PurchasesOffering } from "react-native-purchases";
import { firebaseApp, db } from "../../firebaseConfig";
import SVGComponent from "../SVGComponent";
import { styles } from "./style";
import VIPModal from "./VIPModal";
import ProductPressable from "./ProductPressable";
import { useTranslation } from "../../TranslationContext";

// Constants are defined explicitly for the component's configuration and functionality.
const APIKeys = {
  google: "goog_PVdjbAZwXexWWtSxjDDspHPFkVS",
};

const JETON_MAPPING = {
  "100_mesaj": 100,
  "200_mesaj": 200,
  "1000_mesaj": 1000,
  "1500_mesaj": 5000,
};

export default function BuyToken() {
  // States for modal visibility, current offerings, and user's jetons are initialized.
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOffering, setCurrentOffering] =
    useState<PurchasesOffering | null>(null);
  const [userJetons, setUserJetons] = useState<number>(0);
const i18n = useTranslation();

  // The useEffect hook is employed to initialize necessary configurations and perform initial data fetching.
  useEffect(() => {
    // Configuration step for the Purchases SDK specific to Android platform.
    if (Platform.OS === "android") {
      Purchases.configure({ apiKey: APIKeys.google });
    }

    // An asynchronous function defined to fetch product offerings and user's jetons from the database.
    const setup = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        setCurrentOffering(offerings.current);

        const userId = firebaseApp.auth().currentUser?.uid;
        if (userId) {
          const userRef = db.collection("users").doc(userId);
          // Real-time updates from Firestore are obtained using the onSnapshot method.
          const unsubscribe = userRef.onSnapshot(
            (doc) => {
              if (doc.exists) {
                setUserJetons(doc.data()?.jetons || 0);
              } else {
                Alert.alert(i18n.t("error"), i18n.t("no_document_found"));
              }
            },
            (error) => {
              Alert.alert("Error", `Error fetching user jetons: ${error}`);
            }
          );

          // Cleanup is performed to unsubscribe from Firestore listener when the component is unmounted.
          return () => unsubscribe();
        }
      } catch (error) {
        Alert.alert("Error", `Error in setup: ${error}`);
      }
    };

    // The setup function is invoked immediately within the useEffect.
    setup();
  }, []);

  // Function definition for handling the purchase of a product.
  const purchaseProduct = async (product: any) => {
    try {
      const purchaseMade = await Purchases.purchasePackage(product);
      if (purchaseMade) {
            Alert.alert(i18n.t("success"), i18n.t("jeton_added"));


        const jetonsToCredit =
          JETON_MAPPING[
            product.product.identifier as keyof typeof JETON_MAPPING
          ];
        if (jetonsToCredit) {
          const userId = firebaseApp.auth().currentUser?.uid;
          if (userId) {
            await db
              .collection("users")
              .doc(userId)
              .update({
                jetons: userJetons + jetonsToCredit,
              });
          } else {
            Alert.alert("Error", "User not found.");
          }
        }
      }
    } catch (error) {
      Alert.alert(i18n.t("error"), i18n.t("payment_failed"));
    }
  };

  const BestOffer: React.FC = () => (
    <View style={styles.bestOfferContainer}>
      <Text style={styles.bestOfferText}>Best Price!</Text>
    </View>
  );

  // If there's no current offerings data, a loading message is displayed to the user.
  if (!currentOffering) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c48cbc" />
      </View>
    );
  }

  // The component's UI is rendered based on the current state and data.
  return (
    <View style={styles.container}>
      <VIPModal
        isVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
      />
      <View style={styles.balance}>
        <SVGComponent iconName="vipuser" customWidth="70" customHeight="70" />
        <Text style={styles.balancetext}>
          {i18n.t("become_vip_and_gain_features")}
        </Text>
        <Pressable
          style={styles.buttonVIP}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: "#fff" }}>{i18n.t("examine")}</Text>
        </Pressable>
      </View>
      <View style={styles.flexBox}>
        {currentOffering.availablePackages.map((pkg, index) => (
          <View key={pkg.product.identifier} style={{ position: "relative" }}>
            {index === 1 && <BestOffer />}
            <ProductPressable pkg={pkg} purchaseProduct={purchaseProduct} />
          </View>
        ))}
      </View>
    </View>
  );
}
