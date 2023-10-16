import React, { useEffect, useState, useRef } from "react";
import { Text, StyleSheet, Image, Pressable } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  NavigationState,
  Route,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import SignUp from "./components/Authentication/SignUp/SignUp";
import { Home } from "./components/Home/Home";
import Anasayfa from "./components/Anasayfa/Anasayfa";
import Profile from "./components/Profile/Profile";
import FooterNav from "./components/FooterNav/FooterNav";
import MessageScreen from "./components/Messages/Messages";
import UserProfile from "./components/UserProfile/UserProfile";
import ConversationsList from "./components/MessagedUsers/MessagedUsers";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BuyToken from "./components/BuyToken/BuyToken";
import { auth } from "./firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import LoadingScreen from "./components/UI/Loading/Loading";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SVGComponent from "./components/SVGComponent";
import FilterScreen from './components/Filter/Filter';
import NotificationScreen from "./components/Notification/Notification";
import { TranslationProvider } from "./TranslationContext";
import UserMatches from './components/UserMatches/UserMatches';

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#f5fafb",
  },
};


 
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  password?: string; // Make password optional
  name?: string; // Make name optional
  gender?: string;
}

type MessageScreenRouteParams = {
  user: {
    fullName: string;
    imageUrl: string;
    // ... Other properties that user might have
  };
};

const Stack = createNativeStackNavigator();

function App() {
  enableScreens();
   const navigationRef = useRef(null);
   const [unreadMessages, setUnreadMessages] = useState(false);

   const [user, setUser] = useState<User | null>(null);

   const [isAuth, setIsAuth] = useState(false);
   const [initialized, setInitialized] = useState(false); // State to check if the app has completed its initial data retrieval
   const [authListenerCompleted, setAuthListenerCompleted] = useState(false);
   const [fontsLoaded] = useFonts({
     Poppins: require("./assets/fonts/Poppins-Medium.ttf"),
     PoppinsBold: require("./assets/fonts/Poppins-Black.ttf"),
   });

   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
       if (firebaseUser) {
         await AsyncStorage.setItem("user", JSON.stringify(firebaseUser));
         setUser(firebaseUser);
         setIsAuth(true);
       } else {
         await AsyncStorage.removeItem("user");
         setUser(null);
         setIsAuth(false);
       }
       setAuthListenerCompleted(true); // Important line
     });

     return () => unsubscribe();
   }, []);

   // Fetch user from AsyncStorage
   useEffect(() => {
     if (authListenerCompleted) {
       // Only run if auth listener has completed
       const fetchUserFromStorage = async () => {
         try {
           const storedUserData = await AsyncStorage.getItem("user");
           if (storedUserData) {
             const parsedUserData = JSON.parse(storedUserData);
             setUser(parsedUserData);
             setIsAuth(true);
             setIsFooterVisible(true);
           }
         } catch (error) {
         } finally {
           setInitialized(true);
         }
       };

       fetchUserFromStorage();
     }
   }, [authListenerCompleted]);


  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const onNavigationStateChange = (state: NavigationState | undefined) => {
    if (state) {
      const activeRoute = state.routes[state.index] as Route<string>;
      const shouldShowFooter =
        activeRoute.name !== "Home" &&
        activeRoute.name !== "Login" &&
        activeRoute.name !== "MessageScreen" &&
        activeRoute.name !== "Sign Up";

      setIsFooterVisible(shouldShowFooter);
    } 
  };

  function CustomHeader({ user, navigation }: any) {
    const imageUrl = user?.imageUrl || null;

    return (
      <Pressable
        style={styles.headerContainer}
        onPress={() => navigation.navigate("UserProfile", { user })}
      >
        {imageUrl !== null && (
          <Image source={{ uri: imageUrl }} style={styles.headerImage} />
        )}
        <Text style={styles.headerText}>{user?.fullName || "Chat"}</Text>
      </Pressable>
    );
  }

  if (!fontsLoaded || !initialized) {
    return <LoadingScreen loading={true} />;
  }

  return (
    <TranslationProvider>
      <SafeAreaProvider>
        <NavigationContainer
          onStateChange={onNavigationStateChange}
          theme={Theme}
          ref={navigationRef}
        >
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName={isAuth ? "Anasayfa" : "Home"}
            screenOptions={{
              headerShown: true, // Show header for all screens
              headerBackTitleVisible: false,
              headerShadowVisible: false,
              headerTitleStyle: {
                color: "#fff",
              },
              headerStyle: {
                backgroundColor: "#2cc1d7",
              },
              headerTintColor: "#fff",
              headerTitleAlign: "center",
            }}
          >
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerTitle: "",
              }}
            />
            <Stack.Screen
              name="FilterScreen"
              component={FilterScreen}
              options={{
                headerTitle: "Filtre",
              }}
            />
            <Stack.Screen
              name="UserMatches"
              component={UserMatches}
              options={{
                headerTitle: "Match",
              }}
            />
            <Stack.Screen
              name="Sign Up"
              component={SignUp}
              options={{
                headerTitle: "Kayıt Ol",
              }}
            />
            <Stack.Screen
              name="Anasayfa"
              children={(props) => (
                <Anasayfa {...props} initialized={initialized} />
              )}
              options={({ navigation }) => ({
                headerTitle: "LOVEIFY",
                headerRight: () => (
                  <Pressable
                    onPress={() => navigation.navigate("NotificationScreen")}
                  >
                    <SVGComponent
                      iconName="bell"
                      customWidth="35"
                      customHeight="35"
                    />
                  </Pressable>
                ),
              })}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{
                headerTitle: "Profilim",
              }}
            />
            <Stack.Screen
              name="NotificationScreen"
              component={NotificationScreen}
              options={{
                headerTitle: "Bildirimlerim",
              }}
            />

            <Stack.Screen
              name="JetonScreen"
              component={BuyToken}
              options={{
                headerTitle: "Jeton Al",
              }}
            />
            <Stack.Screen
              name="ConversationsList"
              component={ConversationsList}
              options={{
                headerTitle: "Mesajlarım",
              }}
            />

            <Stack.Screen
              name="UserProfile"
              component={UserProfile}
              options={({ route }) => {
                // Here we tell TypeScript that route.params is of type MessageScreenRouteParams
                const params = route.params as MessageScreenRouteParams;

                return { headerTitle: params.user?.fullName || "Chat" };
              }}
            />

            <Stack.Screen
              name="MessageScreen"
              component={MessageScreen}
              options={({ route, navigation }: any) => {
                const params = route.params as MessageScreenRouteParams;
                return {
                  headerTitle: (props) => (
                    <CustomHeader user={params.user} navigation={navigation} />
                  ),
                };
              }}
            />
          </Stack.Navigator>
          {isFooterVisible && <FooterNav navigationRef={navigationRef} />}
        </NavigationContainer>
      </SafeAreaProvider>
    </TranslationProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerImage: {
    width: 55,
    height: 55,
    borderRadius: 50, // to make it circular
    marginRight: 10, // space between image and text
  },
  headerText: {
    color: "#ffffff",
    fontSize: 18,
  },
});
export default App;
