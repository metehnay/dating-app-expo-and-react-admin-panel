import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import Purchases, { PurchasesOffering } from "react-native-purchases";
import { firebaseApp, db } from "../../firebaseConfig";

const APIKeys = {
  google: "goog_PVdjbAZwXexWWtSxjDDspHPFkVS",
};

const JETON_MAPPING = {
  "100_mesaj": 100,
  "200_mesaj": 200,
  "1000_mesaj": 1000,
  "1500_mesaj": 1500,
};

const Premium = () => {
  const [currentOffering, setCurrentOffering] =
    useState<PurchasesOffering | null>(null);
  const [userJetons, setUserJetons] = useState<number>(0);

  useEffect(() => {
    async function fetchOfferings() {
      if (Platform.OS === "android") {
        Purchases.configure({ apiKey: APIKeys.google });
      }

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
                Alert.alert("Error", "Document not found.");
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
    }

    fetchOfferings();
  }, []);

  async function purchaseProduct(product: any) {
    try {
      const purchaseMade = await Purchases.purchasePackage(product);
      if (purchaseMade) {
        Alert.alert("Success", "Jeton added!");

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
      Alert.alert("Error", "Payment failed.");
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Text style={styles.title}>Loveify</Text>
        <Text style={styles.premium}>MESAJ</Text>
      </View>

      <Text style={styles.subtitle}>Paketler ile profilinizi öne çıkarın</Text>

      <View style={styles.plansContainer}>
        {currentOffering?.availablePackages.map((pkg, index) => (
          <TouchableOpacity
            key={pkg.product.identifier}
            onPress={() => purchaseProduct(pkg)}
            style={[styles.plan, index === 1 ? styles.highlightedPlan : {}]}
          >
            {index === 1 && <Text style={styles.planLabel}>POPULAR</Text>}
            <Text style={styles.planDuration}>
              {
                JETON_MAPPING[
                  pkg.product.identifier as keyof typeof JETON_MAPPING
                ]
              }
            </Text>
            <Text>Mesaj</Text>
            <Text style={styles.planPrice}>{pkg.product.priceString}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Devam Et</Text>
      </TouchableOpacity>

      <Text style={styles.noThanks}>İlgilenmiyorum</Text>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#101010",
  },
  premium: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#101010",
    backgroundColor: "#FFD700",
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
  },
  features: {
    marginLeft: 10,
    marginBottom: 30,
  },
  plansContainer: {
    flexDirection: "column", 
    alignItems: "center",
    marginBottom: 30,
  },
  plan: {
    width: "100%",
    margin: 5,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
    position: "relative",
  },
  highlightedPlan: {
    borderColor: "#FFD700",
    backgroundColor: "#FFFDE7",
  },
  planLabel: {
    position: "absolute",
    top: -20,
    backgroundColor: "#FFD700",
    padding: 8,
    left: 0,
    zIndex: 1,
    borderRadius: 50,
  },
  planDuration: {
    fontSize: 33,
    fontWeight: "bold",
  },
  planPrice: {
    fontSize: 16,
  },
  savings: {
    fontSize: 14,
    color: "green",
  },
  continueButton: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  continueButtonText: {
    fontSize: 18,
    color: "white",
  },
  noThanks: {
    textAlign: "center",
    color: "#aaa",
    marginBottom: 20,
  },
  footer: {
    fontSize: 12,
    color: "#777",
  },
});

export default Premium;
