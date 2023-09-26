import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { firebaseApp } from "../../firebaseConfig";
import LoadingScreen from "./../UI/Loading/Loading";
import UserCard from "./../UI/UserCard/UserCard";

const Anasayfa = ({ navigation, initialized }: any) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [oppositeGender, setOppositeGender] = useState<string | null>(null);

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

        // Fetch the users with the `.get()` method
        const snapshot = await firebaseApp
          .firestore()
          .collection("users")
          .where("gender", "==", gender)
          .limit(20)
          .get();

        const fetchedUsers = snapshot.docs.map((doc) => doc.data());

        if (snapshot.docs.length > 0) {
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
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
          <UserCard item={item} navigation={navigation} />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

export default Anasayfa;
