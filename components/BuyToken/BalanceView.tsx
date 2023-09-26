// Importing all necessary modules and components for the BalanceView component.
import React from "react";
import { View, Text, Pressable } from "react-native";
import SVGComponent from "../SVGComponent";
import { styles } from "./style";

interface BalanceViewProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const BalanceView: React.FC<BalanceViewProps> = ({
  modalVisible,
  setModalVisible,
}) => (
  <View style={styles.balance}>
    <SVGComponent iconName="vipuser" customWidth="70" customHeight="70" />
    <Text style={styles.balancetext}>
      Hemen VIP üye olarak eşsiz özellikler kazan.
    </Text>
    <Pressable style={styles.buttonVIP} onPress={() => setModalVisible(true)}>
      <Text>İncele</Text>
    </Pressable>
  </View>
);

export default BalanceView;
