import React, { useEffect, useRef } from "react";
import { Animated, View, Modal } from "react-native";
import styles from "./style";

interface LogoProps {
  loading: boolean;
}

const LoadingScreen: React.FC<LogoProps> = ({ loading }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  const scale = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(spinValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(spinValue, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [loading]);

  if (!loading) return null;

  return (
    <Modal transparent={true} animationType="none" visible={loading}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <Animated.Image
            source={require("../../../assets/images/home/logoLoveify.png")}
            style={{ width: 244, height: 190, transform: [{ scale: scale }] }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default LoadingScreen;
