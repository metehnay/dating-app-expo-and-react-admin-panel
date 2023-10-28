import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Premium = () => {
  return (
    <View style={styles.container}>
      <View
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Text style={styles.title}>Loveify</Text>
        <Text style={styles.premium}>PREMIUM</Text>
      </View>
      <Text style={styles.subtitle}>See who Likes You and Match with them</Text>

      <View style={styles.features}>
        <Text>✓ Send 2 Direct Messages per day</Text>
        <Text>✓ Reveal Crushes and Visitors</Text>
        <Text>✓ Unlimited Area Reveals</Text>
        <Text>✓ Unlimited Likes</Text>
      </View>

      <View style={styles.plansContainer}>
        {renderPlan("1", "months", "₹270.49/mo")}
        {renderPlan("6", "months", "₹125.49/mo", "POPULAR", "SAVE 53% ₹750.00")}
        {renderPlan("12", "months", "₹95.99/mo")}
      </View>

      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueButtonText}>CONTINUE</Text>
      </TouchableOpacity>
      <Text style={styles.noThanks}>No thanks</Text>
      <Text style={styles.footer}>
        Recurring billing. Cancel anytime. Your subscription will auto-renew...
      </Text>
    </View>
  );
};

function renderPlan(
  duration: string,
  durationType: string,
  price: string,
  label: string | null = null,
  savings: string | null = null
) {
  return (
    <View style={[styles.plan, label ? styles.highlightedPlan : {}]}>
      {label && <Text style={styles.planLabel}>{label}</Text>}
      <Text style={styles.planDuration}>{duration}</Text>
      <Text>{durationType}</Text>
      <Text style={styles.planPrice}>{price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#101010",
  },
  premium: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#101010",
    backgroundColor: "#FFD700",
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
  },
  features: {
    marginLeft: 10,
    marginBottom: 30,
  },
  plansContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  plan: {
    flex: 1,
    paddingVertical: 30,
    margin: 5,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
    position: "relative",
  },
  highlightedPlan: {
    borderColor: "#FFD700",
    backgroundColor: "#FFFDE7",
  },
  planLabel: {
    position: "absolute",
    top: -30,
    backgroundColor: "#FFD700",
    padding: 8,
    zIndex: 1,
    borderRadius: 50,
  },
  planDuration: {
    fontSize: 33,
    fontWeight: "bold",
  },
  planPrice: {
    fontSize: 16,
  },
  savings: {
    fontSize: 14,
    color: "green",
  },
  continueButton: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  continueButtonText: {
    fontSize: 18,
    color: "white",
  },
  noThanks: {
    textAlign: "center",
    color: "#aaa",
    marginBottom: 20,
  },
  footer: {
    fontSize: 12,
    color: "#777",
  },
});

export default Premium;
