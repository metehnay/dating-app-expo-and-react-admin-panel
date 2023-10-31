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
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOffering, setCurrentOffering] =
    useState<PurchasesOffering | null>(null);
  const [userJetons, setUserJetons] = useState<number>(0);
const i18n = useTranslation();

  useEffect(() => {
    if (Platform.OS === "android") {
      Purchases.configure({ apiKey: APIKeys.google });
    }

    const setup = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        setCurrentOffering(offerings.current);

        const userId = firebaseApp.auth().currentUser?.uid;
        if (userId) {
          const userRef = db.collection("users").doc(userId);
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

          return () => unsubscribe();
        }
      } catch (error) {
        Alert.alert("Error", `Error in setup: ${error}`);
      }
    };

    setup();
  }, []);

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

  if (!currentOffering) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c48cbc" />
      </View>
    );
  }

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
