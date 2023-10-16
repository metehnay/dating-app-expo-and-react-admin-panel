import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import styles from "./style";
import SVGComponent from "./../../SVGComponent";
import { useTranslation } from './../../../TranslationContext';

const getAge = (birthdateString: any) => {
  if (!birthdateString) {
    return "28"; // or return some default value if birthDate is missing
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
    age--; // Subtract a year if the birthday hasn't occurred yet this year
  }
  return age;
};

const UserCard = ({ item, navigation }: any) => {
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth / 2 - 10;
  const imageHeight = imageWidth * 1.4; // Set a fixed height, adjust as needed
  const i18n = useTranslation(); // Step 2: Use

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
          {displayedHobbies.map((hobby: string, index: number) => (
            <View key={index} style={styles.hobbyPill}>
              {/* Step 3: Replace the displayed hobby text with the translated text */}
              <Text style={styles.hobbyText}>{i18n.t(hobby)}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;
