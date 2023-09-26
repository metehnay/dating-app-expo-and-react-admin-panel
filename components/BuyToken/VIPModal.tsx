import React, { useState } from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import { styles } from "./VIPstyles"; // adjust the path accordingly
import { firebaseApp, db } from "../../firebaseConfig";
import SVGComponent from "../SVGComponent";

const VIPModal = ({ isVisible, closeModal }: any) => {
  const [userJetons, setUserJetons] = useState<number>(0); // Make sure this line exists at the top of your BuyToken function
  const [selectedVIP, setSelectedVIP] = useState<keyof typeof VIP_COST | null>(
    null
  );

  const VIP_COST = {
    "1 Aylık VIP": 1050,
    "1 Yıllık VIP": 3000,
  };

  React.useEffect(() => {
    const fetchJetons = async () => {
      const loggedInUserId = firebaseApp.auth().currentUser?.uid;
      if (!loggedInUserId) {
        console.error("No logged-in user found!");
        return;
      }

      const userRef = db.collection("users").doc(loggedInUserId);
      const doc = await userRef.get();

      if (doc.exists) {
        const userData = doc.data();
        setUserJetons(userData?.jetons || 0);
      }
    };

    fetchJetons();
  }, []);

 const handleVIPPurchase = async () => {
   if (!selectedVIP) {
     alert("Lütfen bir VIP paketi seçin!");
     return;
   }

   if (userJetons < VIP_COST[selectedVIP]) {
     alert("Yetersiz jeton!");
     return;
   }

   // Deduct jetons from local state
   setUserJetons((prevJetons) => prevJetons - VIP_COST[selectedVIP]);

   // Calculate expiration date
   const currentDate = new Date();
   let expirationDate: Date = new Date(currentDate); // Initialized to current date

   if (selectedVIP === "1 Aylık VIP") {
     expirationDate = new Date(
       currentDate.setMonth(currentDate.getMonth() + 1)
     ); // Add 1 month
   } else if (selectedVIP === "1 Yıllık VIP") {
     expirationDate = new Date(
       currentDate.setFullYear(currentDate.getFullYear() + 1)
     ); // Add 1 year
   }

   // Update jetons, isVip status, and VIP expiration date in Firebase
   const userId = firebaseApp.auth().currentUser?.uid;
   if (!userId) {
     return;
   }

   const userRef = db.collection("users").doc(userId);
   try {
     await userRef.update({
       jetons: userJetons - VIP_COST[selectedVIP],
       isVip: true,
       vipExpiration: expirationDate.toISOString(), // Convert to string for easy storage and retrieval
     });
     alert("VIP satın alma başarılı!");
   } catch (error) {
     alert("Bir hata oluştu!");
     // In case of an error, revert the local state change
     setUserJetons((prevJetons) => prevJetons + VIP_COST[selectedVIP]);
   }
  
 };

  return (
    <ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headerButtons}>
              <Pressable
                style={
                  selectedVIP === "1 Aylık VIP"
                    ? styles.buttonMonthlySelected
                    : styles.buttonMonthly
                }
                onPress={() => setSelectedVIP("1 Aylık VIP")}
              >
                <Text style={styles.buttonText}>1 Aylık VIP</Text>
                <Text style={styles.popularText}>En Popüler</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <SVGComponent
                    iconName="jeton"
                    customWidth="35"
                    customHeight="35"
                  />
                  <Text style={styles.buttonText}>1050</Text>
                </View>
              </Pressable>

              <Pressable
                style={
                  selectedVIP === "1 Yıllık VIP"
                    ? styles.buttonYearlySelected
                    : styles.buttonYearly
                }
                onPress={() => setSelectedVIP("1 Yıllık VIP")}
              >
                <Text style={styles.buttonText}>1 Yıllık VIP</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <SVGComponent
                    iconName="jeton"
                    customWidth="35"
                    customHeight="35"
                  />
                  <Text style={styles.buttonText}>3000</Text>
                </View>
              </Pressable>
            </View>

            <View style={styles.featureCard}>
              <SVGComponent
                iconName="vip1"
                customWidth="35"
                customHeight="35"
              />
              <Text style={styles.featureText}>
                Elmas rozeti alarak profilini öne çıkart. Daha çok kişiden mesaj
                al
              </Text>
            </View>
            <View style={styles.featureCard}>
              <SVGComponent
                iconName="vip2"
                customWidth="35"
                customHeight="35"
              />

              <Text style={styles.featureText}>
                Profiline kimlerin baktığını gör
              </Text>
            </View>
            <View style={styles.featureCard}>
              <SVGComponent
                iconName="vip3"
                customWidth="35"
                customHeight="35"
              />

              <Text style={styles.featureText}>Partnerine fotoğraf gönder</Text>
            </View>
            <View style={styles.featureCard}>
              <SVGComponent
                iconName="vip4"
                customWidth="35"
                customHeight="35"
              />

              <Text style={styles.featureText}>
                Filtreme yaparak yakınındaki insanlarla tanış
              </Text>
            </View>
            <View style={styles.featureCard}>
              <SVGComponent
                iconName="vip5"
                customWidth="35"
                customHeight="35"
              />

              <Text style={styles.featureText}>
               Mesaj limitine takılmadan sınırsız mesaj gönder.
              </Text>
            </View>
            <View style={styles.featureCard}>
              <SVGComponent
                iconName="vip6"
                customWidth="35"
                customHeight="35"
              />

              <Text style={styles.featureText}>
                3 kişiye ücretsiz kahve ısmarla
              </Text>
            </View>
            <Pressable
              style={styles.buttonContinue}
              onPress={handleVIPPurchase}
            >
              <Text style={styles.buttonText}>Seçimi Onayla VIP ol</Text>
            </Pressable>
            <Pressable style={styles.buttonCancel} onPress={closeModal}>
              <Text style={styles.buttonText}>Vazgeç</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default VIPModal;
