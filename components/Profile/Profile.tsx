import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { firebaseApp, storage } from "../../firebaseConfig";
import { styles } from "./style";
import SVGComponent from "../SVGComponent";
import Dialog from "react-native-dialog";
import CityPicker from "../Hooks/CityPicker";
import BirthdayPicker from "../Hooks/BirthdayPicker";
import HobbiesModal from "./HobbiesModal";
import PhysicalAttributesModal from "./PhysicalAttributes";
import { useTranslation } from "../../TranslationContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const Profile = ({ navigation }: any) => {
  const [user, setUser] = useState<any>({});
  const [jetons, setJeton] = useState(0);
  const db = firebaseApp.firestore();
  const currentUser = firebaseApp.auth().currentUser;
  const [physicalAttributesModalVisible, setPhysicalAttributesModalVisible] =
    useState(false);

  const [hobbiesModalVisible, setHobbiesModalVisible] = useState(false);
  const [userHobbies, setUserHobbies] = useState<string[]>([]);

  if (!currentUser) return null;

  const userRef = db.collection("users").doc(currentUser.uid);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [tempName, setTempName] = useState("");
  const [modalBirthdayVisible, setModalBirthdayVisible] = useState(false);
  const [bio, setBio] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [modalCityVisible, setModalCityVisible] = useState(false);
  const [bioDialogVisible, setBioDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  // Physical attributes state
  const [ModalVisible, setModalVisible] = useState(false);
  const [selectedHeight, setSelectedHeight] = useState<string>("");
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [selectedEyeColor, setSelectedEyeColor] = useState<string>("");
  const [selectedHairColor, setSelectedHairColor] = useState<string>("");
  const i18n = useTranslation();

  const showPhysicalAttributesModal = () => {
    setPhysicalAttributesModalVisible(true);
  };

  const handleSavePhysicalAttributes = async () => {
    try {
      // Save physical attributes to Firebase
      await userRef.update({
        height: selectedHeight,
        weight: selectedWeight,
        eyeColor: selectedEyeColor,
        hairColor: selectedHairColor,
      });

      // Close the modal
      setHobbiesModalVisible(false);

      // Alert user about successful save
      alert(i18n.t("profileUpdated"));
    } catch (error) {
      alert(i18n.t("error"));
    }
  };

  const uriToBlob = (uri: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };
const handleLogout = async () => {
  try {
    // Sign out from Google
    await GoogleSignin.signOut();

    // Sign out from Firebase
    await firebaseApp.auth().signOut();

    navigation.navigate("Home");
  } catch (error) {
    console.error("Logout Error:", error); // Log the actual error for better debugging

    alert(i18n.t("error"));
  }
};
  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert(i18n.t("permissionPhoto"));
        return;
      }
    }

    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;

      try {
        setLoading(true); // Set loading to true before starting the upload

        const fileBlob = await uriToBlob(selectedImageUri);

        const ref = storage
          .ref()
          .child(`user-images/resized/${currentUser.uid}`);
        await ref.put(fileBlob);
        const downloadURL = await ref.getDownloadURL();
        await currentUser.updateProfile({
          photoURL: downloadURL,
        });

        setAvatarUrl(downloadURL);

        await userRef.update({
          imageUrl: downloadURL,
        });

        setLoading(false); // Set loading to false after successful upload
      } catch (error) {
        console.log(error);
        alert(i18n.t("error"));
        setLoading(false); // Set loading to false on error
      }
    }
  };

  const handleBirthdaySelection = async (
    day: string,
    month: string,
    year: string
  ) => {
    const birthDate = `${day}-${month}-${year}`;
    setUser((prevUser: any) => ({ ...prevUser, birthDate }));
    if (userRef) {
      userRef.update({
        birthDate: birthDate,
      });
    }
  };

  const updateHobbiesInFirebase = async (hobbies: string[]) => {
    try {
      await userRef.update({
        hobbies: hobbies,
      });
      alert(i18n.t("profileUpdated"));
    } catch (error) {
      alert(i18n.t("error"));
    }
  };

  const showCityModal = () => {
    setSelectedCity(user?.city || "");
    setModalCityVisible(true);
  };

  const handleCitySelection = async (city: string) => {
    setSelectedCity(city);
    setUser({ ...user, city });
    setModalCityVisible(false);
    alert(i18n.t("profileUpdated"));
    if (userRef) {
      try {
        await userRef.update({
          city: city,
        });
      } catch (error) {}
    }
  };

  const showNameDialog = () => {
    setTempName(user?.fullName || "");
    setDialogVisible(true);
  };

  const handleUpdateName = async () => {
    if (tempName !== user?.fullName) {
      try {
        await userRef.update({
          fullName: tempName,
        });
        setUser({ ...user, fullName: tempName });
        alert(i18n.t("profileUpdated"));
      } catch (error) {
        alert(i18n.t("error"));
      }
    }
    setDialogVisible(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const doc = await userRef.get();
        if (doc.exists) {
          const userData = doc.data();
          setUser({
            ...userData,
            uid: currentUser?.uid,
            photoURL: currentUser?.photoURL,
            isVip: userData?.isVip || false,
            hobbies: userData?.hobbies || [],
          });
          setAvatarUrl(currentUser?.photoURL || "");
          setJeton(userData?.jetons || 0);
        } else {
          setUser({
            uid: currentUser?.uid,
            photoURL: currentUser?.photoURL,
            displayName: currentUser?.displayName,
            isVip: false, // Default value
          });
        }
      } catch (error) {
        alert(i18n.t("error"));
      }
    };
    fetchUserData();
  }, []);

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const showDeleteDialog = () => {
    setDeleteDialogVisible(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteDialogVisible(false);
    await handleDeleteAccount();
  };

  const handleDeleteAccount = async () => {
    try {
      await userRef.delete();
      await currentUser.delete();
      navigation.navigate("Home");
    } catch (error) {
      alert(i18n.t("error"));
    }
  };

  const handleHobbiesSelection = (selectedHobbies: string[]) => {
    if (selectedHobbies.length > 5) {
      alert(i18n.t("maxHobbies"));
      return;
    }

    setUserHobbies(selectedHobbies);

    // Update the selected hobbies in Firebase
    updateHobbiesInFirebase(selectedHobbies);
  };
  return (
    <FlatList
      contentContainerStyle={{ ...styles.container, minHeight: "150%" }}
      data={[1]}
      keyExtractor={(item) => item.toString()}
      renderItem={() => (
        <>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : avatarUrl ? (
            <View style={{ alignItems: "center" }}>
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
              <SVGComponent
                iconName="avatar"
                customWidth="150"
                customHeight="150"
              />
            </View>
          )}
          <Text style={styles.name}>{user?.fullName}</Text>

          <Pressable style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>📷 {i18n.t("changePhoto")}</Text>
          </Pressable>
          <View style={styles.jeton}>
            <Text style={{ color: "#fff", paddingRight: 8 }}>
              {i18n.t("totalJeton")}: {jetons}
            </Text>
            <SVGComponent iconName="jeton" />
          </View>

          <View style={styles.card}>
            <Text style={styles.profil}>{i18n.t("myProfile")}</Text>
            <Pressable onPress={showNameDialog}>
              <Text style={styles.menuText}>🙋‍♂️ {i18n.t("myName")}</Text>
            </Pressable>
            <Dialog.Container visible={dialogVisible}>
              <Dialog.Title>{i18n.t("changeName")}</Dialog.Title>
              <Dialog.Input
                label={i18n.t("yourFullName")}
                value={tempName}
                onChangeText={setTempName}
              />
              <Dialog.Button
                label={i18n.t("cancelText")}
                onPress={() => setDialogVisible(false)}
              />
              <Dialog.Button
                label={i18n.t("updateText")}
                onPress={handleUpdateName}
              />
            </Dialog.Container>
            <Pressable onPress={() => setModalBirthdayVisible(true)}>
              <Text style={styles.menuText}>🎂 {i18n.t("myBirthday")}</Text>
            </Pressable>
            <BirthdayPicker
              isVisible={modalBirthdayVisible}
              onClose={() => setModalBirthdayVisible(false)}
              onSelectDate={handleBirthdaySelection}
            />
           
            <Pressable onPress={() => setHobbiesModalVisible(true)}>
              <Text style={styles.menuText}>🎨 {i18n.t("myHobbies")}</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(true)}>
              <Text style={styles.menuText}>
                👤 {i18n.t("myPhysicalStats")}
              </Text>
            </Pressable>
            <PhysicalAttributesModal
              isVisible={ModalVisible}
              onClose={() => setModalVisible(false)}
              selectedHeight={selectedHeight}
              setSelectedHeight={setSelectedHeight}
              selectedWeight={selectedWeight}
              setSelectedWeight={setSelectedWeight}
              selectedEyeColor={selectedEyeColor}
              setSelectedEyeColor={setSelectedEyeColor}
              selectedHairColor={selectedHairColor}
              setSelectedHairColor={setSelectedHairColor}
              handleSavePhysicalAttributes={handleSavePhysicalAttributes}
            />

            <HobbiesModal
              isVisible={hobbiesModalVisible}
              onClose={() => setHobbiesModalVisible(false)}
              onSelectHobbies={handleHobbiesSelection}
            />
          </View>
          <View style={[styles.card, { marginVertical: 20 }]}>
            <Pressable onPress={showDeleteDialog}>
              <Text style={styles.profil}>{i18n.t("accountSettings")}</Text>
              <Text style={styles.menuText}>🗑️ {i18n.t("accountRemove")}</Text>
            </Pressable>
            <Pressable onPress={handleLogout}>
              <Text style={styles.menuText}>🚪{i18n.t("accountLogout")}</Text>
            </Pressable>
          </View>
          <Dialog.Container visible={deleteDialogVisible}>
            <Dialog.Title>🗑️ {i18n.t("accountRemove")}</Dialog.Title>
            <Dialog.Description>
              {i18n.t("accountRemoveText")}
            </Dialog.Description>
            <Dialog.Button
              label={i18n.t("accountRemoveNo")}
              onPress={() => setDeleteDialogVisible(false)}
            />
            <Dialog.Button
              label={i18n.t("accountRemoveYes")}
              onPress={handleConfirmDelete}
            />
          </Dialog.Container>
        </>
      )}
    />
  );
};

export default Profile;
