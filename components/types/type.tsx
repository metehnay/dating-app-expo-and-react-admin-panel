import { Animated } from "react-native";

export interface HomeProps {
  navigation: {
    navigate: (route: string) => void;
  };
}

export interface LogoProps {
  scale: Animated.AnimatedInterpolation<any>;
}

export interface LoadingModalProps {
  visible: boolean;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  textcolor?: any;
}

export interface InputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  secureTextEntry?: boolean;
  placeholderColor?: any;
}
