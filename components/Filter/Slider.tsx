import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  PanResponder,
  Dimensions,
  StyleSheet,
  PanResponderInstance,
} from "react-native";

const SCREEN_WIDTH: number = Dimensions.get("window").width;
const SLIDER_WIDTH: number = SCREEN_WIDTH - 30; // leaving 30 margin on each side
const MAX_AGE: number = 60;
const MIN_AGE: number = 18;
const THUMB_RADIUS: number = 15;

interface AgeRange {
  start: number;
  end: number;
}

interface SliderProps {
  onChange?: (start: number, end: number) => void;
}

const Slider: React.FC<SliderProps> = ({ onChange }) => {
 const middleOfSlider = SLIDER_WIDTH / 2;
 const [leftThumb, setLeftThumb] = useState<number>(
   middleOfSlider - THUMB_RADIUS
 );
 const [rightThumb, setRightThumb] = useState<number>(
   middleOfSlider + THUMB_RADIUS
 );
  const leftValue = useRef<number>(MIN_AGE);
  const rightValue = useRef<number>(MAX_AGE);

  const calculateAge = (percentage: number): number => {
    return Math.round((MAX_AGE - MIN_AGE) * percentage + MIN_AGE);
  };

  const leftResponder: PanResponderInstance = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
          let newLeft = leftThumb + gestureState.dx;
          if (newLeft >= 0 && newLeft <= rightThumb - 60) {
            setLeftThumb(newLeft);
            leftValue.current = calculateAge(newLeft / SLIDER_WIDTH);
            onChange && onChange(leftValue.current, rightValue.current); // Add this line
          }
        },
        onPanResponderRelease: () => {},
      }),
    [leftThumb, rightThumb]
  );

  const rightResponder: PanResponderInstance = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
          let newRight = rightThumb + gestureState.dx;
          if (newRight <= SLIDER_WIDTH && newRight >= leftThumb + 60) {
            setRightThumb(newRight);
            rightValue.current = calculateAge(
              1 - (SLIDER_WIDTH - newRight) / SLIDER_WIDTH
            );
            onChange && onChange(leftValue.current, rightValue.current); // Add this line
          }
        },
        onPanResponderRelease: () => {},
      }),
    [leftThumb, rightThumb]
  );

  return (
    <View style={styles.container}>
      <View style={styles.slider}>
        <View style={styles.baseTrack} />
        <View
          style={[
            styles.track,
            { width: rightThumb - leftThumb, left: leftThumb },
          ]}
        />
        <View
          {...leftResponder.panHandlers}
          style={[
            styles.thumb,
            {
              left: leftThumb - THUMB_RADIUS,
              zIndex: 1, // ensures the left thumb is on top when they overlap
              borderColor:
                leftThumb === rightThumb - THUMB_RADIUS * 2
                  ? "transparent"
                  : "#FFFFFF",
            },
          ]}
        />

        <View
          {...rightResponder.panHandlers}
          style={[
            styles.thumb,
            {
              left: rightThumb - THUMB_RADIUS,
              borderColor:
                leftThumb === rightThumb - THUMB_RADIUS * 2
                  ? "transparent"
                  : "#FFFFFF",
            },
          ]}
        />
      </View>
      <Text>
        {leftValue.current} Yaş - {rightValue.current} Yaş Arası
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  slider: {
    width: SLIDER_WIDTH,
    height: 40,
    backgroundColor: "#E0E0E0", // A bit darker base color to contrast with the track
    borderRadius: 20,
    position: "relative",
    marginBottom: 20,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  baseTrack: {
    // This is new
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0D0D0",
    position: "absolute",
    top: "50%",
    width: "100%",
    transform: [{ translateY: -4 }],
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff95d3",
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -4 }],
  },
  thumb: {
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    backgroundColor: "#ff95d3",
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -THUMB_RADIUS }],
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 2, // New line
    borderColor: "#FFFFFF", // New line
  },
});

export default Slider;
