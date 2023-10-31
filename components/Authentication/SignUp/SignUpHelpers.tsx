import { Alert, Linking, Platform } from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { storage, firebaseApp } from "../../../firebaseConfig";
import { useTranslation } from "../../../TranslationContext";

const MAX_RETRIES = 3;
let retryCount = 0;

export const askForLocationPermission = async (
  setSelectedCity: Function,
  t: Function,
  setSelectedCode: Function
) => {
  let { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      t("locationPermissionRequired"),
      t("locationPermissionDescription"),
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: t("goToSettings"), onPress: () => Linking.openSettings() },
      ]
    );
    return;
  }

  let location = await Location.getCurrentPositionAsync({});
  let addresses = await Location.reverseGeocodeAsync(location.coords);

  if (addresses && addresses.length > 0) {
    setSelectedCity(addresses[0].region); 
    setSelectedCode(addresses[0].isoCountryCode);
  } else {
    retryCount++;
    attemptFetchingRegionCode(setSelectedCity, setSelectedCode, location);
  }
};

const attemptFetchingRegionCode = async (
  setSelectedCity: Function,
  setSelectedCode: Function,
  location: any
) => {
  if (retryCount >= MAX_RETRIES) return;

  setTimeout(async () => {
    let addresses = await Location.reverseGeocodeAsync(location.coords);

    if (addresses && addresses.length > 0) {
      setSelectedCity(addresses[0].region); 
      setSelectedCode(addresses[0].isoCountryCode);
    } else {
      setSelectedCode("US");
      attemptFetchingRegionCode(setSelectedCity, setSelectedCode, location);
    }
  }, 5000);
};

export const handleImageUpload = async (
  setIsUploading: Function,
  setSelectedImageUri: Function,
  t: Function,
  setImageUrl: Function
) => {
  if (Platform.OS !== "web") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert(t("PermissionNeeded"));
      return;
    }
  }

  const result: any = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 4],
  });

  if (result.canceled) return;

  if (result.assets && result.assets.length > 0) {
    const selectedImageUri = result.assets[0].uri;
    setSelectedImageUri(selectedImageUri);

    try {
      setIsUploading(true);

      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const blob: any = xhr.response;
        const ref = storage
          .ref()
          .child(`user-images/${firebaseApp.auth().currentUser?.uid}`);
        ref.put(blob).then(async () => {
          const downloadURL = await ref.getDownloadURL();
          setImageUrl(downloadURL);
          setIsUploading(false);
        });
      };
      xhr.onerror = function () {
        setIsUploading(false);
      };
      xhr.responseType = "blob";
      xhr.open("GET", selectedImageUri, true);
      xhr.send(null);
    } catch (error) {
      alert(t("error"));
      setIsUploading(false);
    }
  }
};
