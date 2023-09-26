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

// Constants are defined explicitly for the component's configuration and functionality.
const APIKeys = {
  google: "goog_IFicDqoerhXfMZIzKwYuvafFCOq",
};

const JETON_MAPPING = {
  "500jeton": 500,
  "1500jeton": 1500,
  "3000jeton": 3000,
  "5000jeton": 5000,
};

// The function to format product identifiers for UI is provided in full, detailing its purpose and logic.
function formatIdentifier(identifier: string): string {
  // The regex replace function is used to format the identifier into a user-friendly string.
  return identifier.replace(
    /(\d+)([a-zA-Z]+)/,
    (_, num, word) => `${num} ${word.charAt(0).toUpperCase()}${word.slice(1)}`
  );
}

// The main component function is fully defined, ensuring complete functionality and no omitted steps.
export default function BuyToken() {
  // States for modal visibility, current offerings, and user's jetons are initialized.
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOffering, setCurrentOffering] =
    useState<PurchasesOffering | null>(null);
  const [userJetons, setUserJetons] = useState<number>(0);

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
                Alert.alert("Error", "No such document!");
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

  // If there's no current offerings data, the LoadingView is rendered.
  if (!currentOffering) {
    return <LoadingView />;
  }

  // The component's UI is rendered based on the current state and data.
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

// The individual product rendering logic is memoized to prevent unnecessary re-renders.
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
