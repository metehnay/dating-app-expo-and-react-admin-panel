import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import styles from "./style";
import SVGComponent from "./../../SVGComponent";
import { useTranslation } from "./../../../TranslationContext";

const getAge = (birthdateString: any) => {
  if (!birthdateString) {
    return "28"; 
  }

  const [day, month, year] = birthdateString.split("-");
  const birthdate = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10)
  );
  const today = new Date();

  let age = today.getFullYear() - birthdate.getFullYear();
  const m = today.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    age--; 
  }
  return age;
};

const UserCard = ({ item, navigation, currentUserCity }: any) => {
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth / 2 - 10;
  const imageHeight = imageWidth * 1.4; 
  const i18n = useTranslation(); 
  const displayedHobbies = item.hobbies?.slice(0, 1) || [];

  return (
    <TouchableOpacity
      style={{ padding: 5 }}
      onPress={() => navigation.navigate("UserProfile", { user: item })}
    >
      <View style={styles.card}>
        <Image
          source={
            item?.imageUrl
              ? { uri: item.imageUrl }
              : require("../../../assets/images/home/avatar.jpg")
          }
          style={{
            width: imageWidth,
            height: imageHeight,
            borderRadius: 5,
            resizeMode: "cover",
          }}
        />

        {item?.isVip && (
          <View style={styles.vipIconContainer}>
            <SVGComponent iconName="vip1" customWidth="35" customHeight="35" />
          </View>
        )}

        <View style={styles.cardbox}>
          <View style={styles.nameAgeContainer}>
            <Text style={styles.cardtext}>
              {item?.fullName || "Gizli"}, {getAge(item?.birthDate)}{" "}
              <SVGComponent iconName="dot" customWidth="14" customHeight="14" />
            </Text>
          </View>
          {currentUserCity && (
            <View style={styles.hobbyPill}>
              <Text style={styles.hobbyText}>{currentUserCity}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;
