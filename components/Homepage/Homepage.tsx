import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { firebaseApp } from "../../firebaseConfig";
import LoadingScreen from "../UI/Loading/Loading";
import UserCard from "../UI/UserCard/UserCard";

const Homepage = ({ navigation, initialized }: any) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [oppositeGender, setOppositeGender] = useState<string | null>(null);
  
  const [region, setRegion] = useState<string | null>(null); // New state for region
  const [city, setCity] = useState<string | null>(null); // New state for region

  useEffect(() => {
    const currentUser = firebaseApp.auth().currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchGenderAndInitialUsers = async () => {
      try {
        const docSnapshot = await firebaseApp
          .firestore()
          .doc(`users/${currentUser.uid}`)
          .get();
        const userData = docSnapshot.data();

        if (!userData || !userData.gender) throw new Error("No gender data");

        const gender = userData.gender === "male" ? "female" : "male";
        setOppositeGender(gender);

        setRegion(userData.regionCode || "US"); // set region or default to 'US'
        setCity(userData.city || null);

        // Modify the fetch logic
        const snapshot = await firebaseApp
          .firestore()
          .collection("users")
          .where("gender", "==", gender)
          .where("regionCode", "==", userData.regionCode || "US") // add regionCode filter
          .limit(8)
          .get();

        const fetchedUsers = snapshot.docs.map((doc) => doc.data());

        if (
          snapshot.docs.length === 0 &&
          userData.regionCode &&
          userData.regionCode !== "US"
        ) {
          // If no users were found for the regionCode, fetch users from the US as fallback
          const fallbackSnapshot = await firebaseApp
            .firestore()
            .collection("users")
            .where("gender", "==", gender)
            .where("regionCode", "==", "US")
            .limit(8)
            .get();

          fetchedUsers.push(...fallbackSnapshot.docs.map((doc) => doc.data()));
        }

        if (fetchedUsers.length > 0) {
          setLastVisible(snapshot.docs[fetchedUsers.length - 1]);
        }

        setUsers(fetchedUsers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenderAndInitialUsers();
  }, [firebaseApp]);

  const fetchMoreUsers = async (gender: string) => {
    if (!lastVisible || isFetching) return;

    setIsFetching(true);
    try {
      const snapshot = await firebaseApp
        .firestore()
        .collection("users")
        .where("gender", "==", gender)
        .startAfter(lastVisible)
        .limit(8)
        .get();

      const fetchedUsers = snapshot.docs.map((doc) => doc.data());

      if (snapshot.docs.length > 0) {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }

      const updatedUsers = [...users, ...fetchedUsers];
      setUsers(updatedUsers);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleLoadMore = () => {
    if (oppositeGender) {
      fetchMoreUsers(oppositeGender);
    }
  };

  if (!initialized || loading) {
    return <LoadingScreen loading={true} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        numColumns={2}
        key={2}
        renderItem={({ item }) => (
          <UserCard item={item} navigation={navigation} currentUserCity={city} />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

export default Homepage;
