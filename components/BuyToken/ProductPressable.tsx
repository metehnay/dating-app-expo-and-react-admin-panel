import React, { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { styles } from "./style";
import LottieView from "lottie-react-native";
import { useTranslation } from "../../TranslationContext"; // Make sure to import this

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
}) => {
  const { t } = useTranslation(); // Destructure the t function for translations

  return (
    <Pressable
      style={styles.productContainer}
      onPress={() => purchaseProduct(pkg)}
    >
      <LottieView
        source={require("./icon.json")}
        autoPlay
        loop
        style={{ width: 55, height: 85 }}
      />
      <Text style={styles.productTitle}>
        {formatIdentifier(pkg.product.identifier)}
      </Text>
      <View style={styles.buyContent}>
        <Text style={styles.productPrice}>{pkg.product.priceString}</Text>
        <Text style={styles.buyButton}>{t("buy_now")}</Text>
      </View>
    </Pressable>
  );
};

export default memo(ProductPressable);
