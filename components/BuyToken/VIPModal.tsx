import React, { useState } from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import { styles } from "./VIPstyles"; // adjust the path accordingly
import { firebaseApp, db } from "../../firebaseConfig";
import SVGComponent from "../SVGComponent";
import { useTranslation } from "../../TranslationContext";

const VIPModal = ({ isVisible, closeModal }: any) => {
  const [userJetons, setUserJetons] = useState<number>(0); // Make sure this line exists at the top of your BuyToken function
  const [selectedVIP, setSelectedVIP] = useState<keyof typeof VIP_COST | null>(
    null
  );
    const { t } = useTranslation();


  const VIP_COST = {
    [t("one_month_vip_key")]: 1050,
    [t("one_year_vip_key")]: 3000,
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
      alert(t("please_select_a_vip_package_key")); // Translation: "Lütfen bir VIP paketi seçin!"
      return;
    }

    if (userJetons < VIP_COST[selectedVIP]) {
      alert(t("insufficient_jetons_key")); // Translation: "Yetersiz jeton!"
      return;
    }

   // Deduct jetons from local state
   setUserJetons((prevJetons) => prevJetons - VIP_COST[selectedVIP]);

   // Calculate expiration date
   const currentDate = new Date();
   let expirationDate: Date = new Date(currentDate); // Initialized to current date

    if (selectedVIP === t("one_month_vip_key")) {
      // "1 Aylık VIP"
      expirationDate = new Date(
        currentDate.setMonth(currentDate.getMonth() + 1)
      ); // Add 1 month
    } else if (selectedVIP === t("one_year_vip_key")) {
      // "1 Yıllık VIP"
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
     alert(t("vip_purchase_successful_key")); // Translation: "VIP satın alma başarılı!"
   } catch (error) {
     alert(t("an_error_occurred_key")); // Translation: "Bir hata oluştu!"
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
                  selectedVIP === t("one_month_vip_key")
                    ? styles.buttonMonthlySelected
                    : styles.buttonMonthly
                }
                onPress={() => setSelectedVIP(t("one_month_vip_key"))}
              >
                <Text style={styles.buttonText}>{t("one_month_vip_key")}</Text>
                <Text style={styles.popularText}>{t("most_popular_key")}</Text>
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
                  selectedVIP === t("one_year_vip_key")
                    ? styles.buttonYearlySelected
                    : styles.buttonYearly
                }
                onPress={() => setSelectedVIP(t("one_year_vip_key"))}
              >
                <Text style={styles.buttonText}>{t("one_year_vip_key")}</Text>
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
              <Text style={styles.featureText}>{t("feature1_text_key")}</Text>
            </View>
            <View style={styles.featureCard}>
              <SVGComponent
                iconName="vip2"
                customWidth="35"
                customHeight="35"
              />
              <Text style={styles.featureText}>{t("feature2_text_key")}</Text>
            </View>
            <View style={styles.featureCard}>
              <SVGComponent
                iconName="vip3"
                customWidth="35"
                customHeight="35"
              />
              <Text style={styles.featureText}>{t("feature3_text_key")}</Text>
            </View>
            <View style={styles.featureCard}>
              <SVGComponent
                iconName="vip4"
                customWidth="35"
                customHeight="35"
              />
              <Text style={styles.featureText}>{t("feature4_text_key")}</Text>
            </View>
            <View style={styles.featureCard}>
              <SVGComponent
                iconName="vip5"
                customWidth="35"
                customHeight="35"
              />
              <Text style={styles.featureText}>{t("feature5_text_key")}</Text>
            </View>
            <View style={styles.featureCard}>
              <SVGComponent
                iconName="vip6"
                customWidth="35"
                customHeight="35"
              />
              <Text style={styles.featureText}>{t("feature6_text_key")}</Text>
            </View>
            <Pressable
              style={styles.buttonContinue}
              onPress={handleVIPPurchase}
            >
              <Text style={styles.buttonText}>
                {t("confirm_vip_choice_key")}
              </Text>
            </Pressable>
            <Pressable style={styles.buttonCancel} onPress={closeModal}>
              <Text style={styles.buttonText}>{t("cancel_key")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default VIPModal;
