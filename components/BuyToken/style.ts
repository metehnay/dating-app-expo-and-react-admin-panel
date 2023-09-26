import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
  },
  loading: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  offeringTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 2 }], // This will scale the spinner 2x its original size
  },
  balance: {
    backgroundColor: "#f4e7ff",
    justifyContent: "center",
    alignItems: "center",
    width: width,
    marginBottom: 14,
  },
  balancetext: {
    color: "#101010",
    padding: 7,
    textAlign: "center",
    fontSize: 14,
  },
  buttonVIP: {
    backgroundColor: "#960ffe",
    padding: 10,
    margin: 10,
    borderRadius: 14,
  },
  buyContent: {
    backgroundColor: "#feeceb",
    display: "flex",
    alignItems: "center",
    padding: 10,
    width: 80,
  },
  productContainer: {
    padding: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#c98aff",
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  buyButton: {
    color: "#101010",
    textAlign: "center",
    borderRadius: 5,
    marginTop: 5,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 10,
    color: "yellow",
  },

  productPrice: {
    fontSize: 16,
    color: "#333",
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
  },
});
