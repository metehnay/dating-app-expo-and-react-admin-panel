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
    display: "flex",
    alignItems: "center",
    padding: 10,
  },
  productContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff7e4",
    marginVertical: 8,
    marginHorizontal: 8,
    padding: 10,
    width: 150,
    borderRadius: 8,
  },
  flexBox: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
    color: "#101010",
  },

  productPrice: {
    fontSize: 16,
    color: "#101010",
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
  },
  bestOfferContainer: {
    position: "absolute",
    top: 10, // Adjust the position as necessary
    left: -10, // This will move it slightly to the left
    backgroundColor: "#FF6347", // Tomato color, change as desired
    borderRadius: 15, // Roundness for the label
    transform: [{ rotate: "-45deg" }], // This will rotate the label
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bestOfferText: {
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: "bold",
  },
});
