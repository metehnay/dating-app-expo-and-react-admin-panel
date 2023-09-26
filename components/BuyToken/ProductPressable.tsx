import React, { memo } from "react";
import { View, Text, Pressable } from "react-native";
import SVGComponent from "../SVGComponent";
import { styles } from "./style";

interface ProductPressableProps {
  pkg: {
    product: {
      identifier: string;
      priceString: string;
    };
  };
  purchaseProduct: (product: any) => Promise<void>;
}

function formatIdentifier(identifier: string): string {
  return identifier.replace(
    /(\d+)([a-zA-Z]+)/,
    (_, num, word) => `${num} ${word.charAt(0).toUpperCase()}${word.slice(1)}`
  );
}

const ProductPressable: React.FC<ProductPressableProps> = ({
  pkg,
  purchaseProduct,
}) => (
  <Pressable style={styles.productContainer} onPress={() => purchaseProduct(pkg)}>
    <View style={styles.flex}>
      <SVGComponent iconName="jeton" customWidth="45" customHeight="45" />
      <Text style={styles.productTitle}>
        {formatIdentifier(pkg.product.identifier)}
      </Text>
    </View>
    <View style={styles.buyContent}>
      <Text style={styles.productPrice}>{pkg.product.priceString}</Text>
      <Text style={styles.buyButton}>Satın Al</Text>
    </View>
  </Pressable>
);

export default memo(ProductPressable);
