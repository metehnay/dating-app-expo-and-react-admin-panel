import React, {useCallback, useEffect} from "react";
import {
  View,
  Text,
  Animated,
  Image,
  Dimensions,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { styles } from "./style";
import SVGComponent from "../SVGComponent";
import { firebaseApp, db } from "../../firebaseConfig";
import ReusableModal from './../VIPModal/VIPModal';
import { useTranslation } from "../../TranslationContext";

const screenWidth = Dimensions.get("window").width;

type GiftType = "coffee" | "star";

interface GiftDetail {
  collection: string;
  type: string;
  sentName: string;
  alertMsg: string;
  alreadySentMsg: string;
}


const UserProfile = ({ route, navigation }: any) => {
  const i18n = useTranslation();

  const GIFT_DETAILS: Record<GiftType, GiftDetail> = {
    coffee: {
      collection: "userCoffees",
      type: "coffee",
      sentName: "sentCoffees",
      alertMsg: i18n.t("coffeeSend"),
      alreadySentMsg: i18n.t("alreadySendCoffee"),
    },
    star: {
      collection: "userStars",
      type: "star",
      sentName: "sentStars",
      alertMsg: i18n.t("starSend"),
      alreadySentMsg: i18n.t("alreadySendStar"),
    },
  };

  const JETON_COST = 100;


  const user = route.params.user;
  const [likes, setLikes] = React.useState<number>(0);
  const [hasLiked, setHasLiked] = React.useState<boolean>(false);
  const [jetons, setJetons] = React.useState<number | null>(null);
  const [hasSentCoffee, setHasSentCoffee] = React.useState(false);
  const [hasStarred, setHasStarred] = React.useState(false);
const [isModalVisible, setModalVisible] = React.useState<boolean>(false);
const [modalMessage, setModalMessage] = React.useState<string>("");
const fetchJetonsAndLikes = useCallback(async () => {
  try {
    const loggedInUserId = firebaseApp.auth().currentUser?.uid;
    if (!loggedInUserId) {
      return;
    }

    // Use a single document reference for loggedInUserId
    const userRef = db.collection("users").doc(loggedInUserId);

    const doc = await userRef.get();

    if (doc.exists) {
      const userData = doc.data();
      setJetons(userData?.jetons || 0);
    }
  } catch (error) {
    alert(i18n.t("error"));
  }

  try {
    const loggedInUserId = firebaseApp.auth().currentUser?.uid;
    if (!loggedInUserId) {
      return;
    }

    // Use a single document reference for userLikes
    const userLikesRef = db.collection("userLikes").doc(user.id);

    const likeDoc = await userLikesRef.get();

    if (likeDoc.exists) {
      const likeData = likeDoc.data();
      if (likeData) {
        setLikes(likeData.likes || 0);
        if (
          likeData.likedUsers &&
          likeData.likedUsers.includes(loggedInUserId)
        ) {
          setHasLiked(true);
        }
      }
    }
  } catch (error) {
    alert("Bir hata oluştu")
  }
}, [user.id]);

    useEffect(() => {
    fetchJetonsAndLikes();
  }, [fetchJetonsAndLikes]); 

 const handleLikePress = async () => {
   const loggedInUserId = firebaseApp.auth().currentUser?.uid;
   if (!loggedInUserId) {
     return;
   }

   const userLikesRef = db.collection("userLikes").doc(user.id);
   const likeDoc = await userLikesRef.get();

   try {
     if (likeDoc.exists) {
       const likeData = likeDoc.data();
       if (likeData) {
         if (
           likeData.likedUsers &&
           likeData.likedUsers.includes(loggedInUserId)
         ) {
           // The user has already liked, so just show the alert as before
           alert(i18n.t("alreadyLikedThisUser"));
         } else {
           const newLikeCount = likeData.likes + 1;
           await userLikesRef.update({
             likes: newLikeCount,
             likedUsers: [...likeData.likedUsers, loggedInUserId],
           });

           // Add a notification to the notifications collection
           await db.collection("notifications").add({
             userId: user.id,
             fromUserId: loggedInUserId,
             type: "like",
             createdAt: new Date(),
           });

           setLikes(newLikeCount);
           setHasLiked(true);

           // Here we replace the alert with setting the modal to visible
           setModalMessage(i18n.t("likeSent"));
           setModalVisible(true);
         }
       }
     } else {
       await userLikesRef.set({
         likes: 1,
         likedUsers: [loggedInUserId],
       });

       // Add a notification to the notifications collection
       await db.collection("notifications").add({
         userId: user.id,
         fromUserId: loggedInUserId,
         type: "like",
         createdAt: new Date(),
       });

       setLikes(1);
       setHasLiked(true);

       // Here again, we replace the alert with setting the modal to visible
       setModalVisible(true);
     }
   } catch (error) {
        alert(i18n.t("error"));
   }
 };


  const sendGift = useCallback(
    async (giftType: GiftType) => {
      const loggedInUserId = firebaseApp.auth()?.currentUser?.uid;
      if (!loggedInUserId) return;

      const { collection, type, sentName, alertMsg, alreadySentMsg } =
        GIFT_DETAILS[giftType];

      if (!jetons || jetons < JETON_COST) {
        setModalMessage(i18n.t("notEnoughJeton"));
        setModalVisible(true);
        return;
      }

      const userGiftRef = db.collection(collection).doc(user.id);
      const giftDoc = await userGiftRef.get();
      const sentGifts = giftDoc.data()?.[sentName] || [];

      if (sentGifts.includes(loggedInUserId)) {
        alert(alreadySentMsg);
        return;
      }

      const isConfirmed = await new Promise((resolve) => {
        Alert.alert(
          i18n.t("info"),
          i18n.t("confirmJetonsDeduct", { jetonCost: JETON_COST }),
          [
            {
              text: "Evet",
              onPress: () => resolve(true),
            },
            {
              text: "Vazgeç",
              onPress: () => resolve(false),
              style: "cancel",
            },
          ]
        );
      });

      if (!isConfirmed) return;

      await userGiftRef.set(
        { [sentName]: [...sentGifts, loggedInUserId] },
        { merge: true }
      );

      // Deduct jetons and update local state
      await db
        .collection("users")
        .doc(loggedInUserId)
        .update({ jetons: jetons - JETON_COST });
      setJetons((prev) => (prev ? prev - JETON_COST : null));

      // Add a notification for the gift
      await db.collection("notifications").add({
        userId: user.id,
        fromUserId: loggedInUserId,
        type: type,
        createdAt: new Date(),
      });

      giftType === "coffee" ? setHasSentCoffee(true) : setHasStarred(true);
      alert(alertMsg);
    },
    [jetons]
  );

  const handleCoffeeSend = useCallback(() => sendGift("coffee"), [sendGift]);
  const handleStarLike = useCallback(() => sendGift("star"), [sendGift]);

  return (
    <ScrollView>
      <Image
        source={
          user.imageUrl
            ? { uri: user.imageUrl }
            : require("../../assets/images/home/avatar.jpg")
        }
        style={{
          width: screenWidth,
          height: screenWidth,
          borderRadius: 5,
          resizeMode: "cover",
          maxHeight: 300,
        }}
      />

      <View style={styles.row1}>
        <Pressable style={styles.row} onPress={handleCoffeeSend}>
          <View style={styles.iconkahve}>
            <SVGComponent iconName="coffee" />
          </View>
          <Text style={styles.rowTex}>{i18n.t("sendCoffee")}</Text>
        </Pressable>

        <Pressable
          style={hasLiked ? styles.rowLiked : styles.rowheart}
          onPress={handleLikePress}
        >
          <View style={styles.iconheart}>
            <SVGComponent iconName="love" />
          </View>
          <Text style={styles.rowTex}>{i18n.t("sendLike")}</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={handleStarLike}>
          <View style={styles.iconfavori}>
            <SVGComponent iconName="favorite" />
          </View>
          <Text style={styles.rowTex}>{i18n.t("sendStar")}</Text>
        </Pressable>

        <Pressable
          style={styles.row}
          onPress={() => navigation.navigate("MessageScreen", { user })}
        >
          <View style={styles.icon}>
            <SVGComponent iconName="chat" />
          </View>
          <Text style={styles.rowTex}>{i18n.t("sendMessage")}</Text>
        </Pressable>
      </View>

      <View style={styles.cardbio}>
        <Text style={styles.title}>{i18n.t("userHobbies")}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {user.hobbies && user.hobbies.length > 0 ? (
              user.hobbies.map((hobby: string, index: number) => (
                <View key={index} style={styles.hobbyPill}>
                  <Text style={styles.hobbyText}>{i18n.t(hobby)}</Text>
                </View>
              ))
            ) : (
              <Text>{i18n.t("noHobbiesInformation")}</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{i18n.t("userFeatures")}</Text>

        <UserProperty label={`📏 ${i18n.t("height")}`} value={user.height} />
        <UserProperty label={`⚖️ ${i18n.t("weight")}`} value={user.weight} />
      </View>
      <ReusableModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => setModalVisible(false)} // You can define another behavior for the button if needed
        iconName={modalMessage === i18n.t("notEnoughJeton") ? "vip1" : "onay"}
        message={modalMessage}
        buttonText="Tamam"
      />
    </ScrollView>
  );
};

const UserProperty = React.memo(({ label, value }: { label: string; value?: string }) => (
  <View style={styles.between}>
    <Text>{label}</Text>
    <Text>{value || "-----"}</Text>
  </View>
));

export default UserProfile;
