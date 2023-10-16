import { Image } from "react-native";
import styles from "./style";

export const Logo: React.FC = () => (
  <Image
    source={require("../../../assets/images/home/logoLoveify.png")}
    style={styles.logo}
  />
);
