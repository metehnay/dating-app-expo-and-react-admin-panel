// Importing all necessary modules and components for this functionality.
import React, { useEffect, useState, memo } from "react";
import { Platform, Text, View, Pressable, Alert } from "react-native";
import Purchases, { PurchasesOffering } from "react-native-purchases";
import { firebaseApp, db } from "../../firebaseConfig";
import { styles } from "./style";
import LoadingView from "./LoadingView";
import BalanceView from "./BalanceView";
import SVGComponent from "../SVGComponent";
import VIPModal from "./VIPModal";

const APIKeys = {
  google: "goog_IFicDqoerhXfMZIzKwYuvafFCOq",
};

const JETON_MAPPING = {
  "500jeton": 500,
  "1500jeton": 1500,
  "3000jeton": 3000,
  "5000jeton": 5000,
};

function formatIdentifier(identifier: string): string {
  return identifier.replace(
    /(\d+)([a-zA-Z]+)/,
    (_, num, word) => `${num} ${word.charAt(0).toUpperCase()}${word.slice(1)}`
  );
}

export default function BuyToken() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOffering, setCurrentOffering] =
    useState<PurchasesOffering | null>(null);
  const [userJetons, setUserJetons] = useState<number>(0);

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
                Alert.alert("Error", "No such document!");
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
        Alert.alert("Success", "Jeton hesabınıza eklendi!");

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
      Alert.alert("Error", "Ödeme tamamlanamadı!");
    }
  };

  if (!currentOffering) {
    return <LoadingView />;
  }

  return (
    <View style={styles.container}>
      <VIPModal
        isVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
      />
      <BalanceView
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />

      {currentOffering.availablePackages.map((pkg) => (
        <ProductPressable
          key={pkg.product.identifier}
          pkg={pkg}
          purchaseProduct={purchaseProduct}
        />
      ))}
    </View>
  );
}

const ProductPressable = memo(
  ({
    pkg,
    purchaseProduct,
  }: {
    pkg: any;
    purchaseProduct: (product: any) => Promise<void>;
  }) => (
    <View style={styles.productContainer}>
      <View style={styles.flex}>
        <SVGComponent iconName="jeton" customWidth="45" customHeight="45" />
        <Text style={styles.productTitle}>
          {formatIdentifier(pkg.product.identifier)}
        </Text>
      </View>
      <Pressable style={styles.buyContent} onPress={() => purchaseProduct(pkg)}>
        <Text style={styles.productPrice}>{pkg.product.priceString}</Text>
        <Text style={styles.buyButton}>Satın Al</Text>
      </Pressable>
    </View>
  )
);
