import { View, Text, Alert, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import React from "react";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { styles } from "../../assets/styles/create.styles.js";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

// Define categories with their respective icons
const CATEGORIES = [
  { id: "food", name: "Food & Drinks", icon: "fast-food" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transportation", icon: "car" },
  { id: "entertainment", name: "Entertainment", icon: "film" },
  { id: "bills", name: "Bills", icon: "receipt" },
  { id: "income", name: "Income", icon: "cash" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

const Create = () => {
  const { user } = useUser();

  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState(CATEGORIES[0].id);
  const [price, setPrice] = React.useState("");
  const [isExpense, setIsExpense] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);


  const handleCreate = async () => {
    //validatiuons
    if (!title.trim()) {
      Alert.alert("Please enetr a title for the transaction");
      return;
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert("Please enter a valid price for the transaction");
      return;
    }
    if (!category) {
      Alert.alert("Please select a category for the transaction");
      return;
    }
    setIsLoading(true);
    
    try {
      const formatPrice = isExpense
        ? -Math.abs(parseFloat(price))
        : Math.abs(parseFloat(price));

      const response = await fetch(
        "http://localhost:5001/api/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            category,
            price: formatPrice,
            user_id: user?.id, // Use user ID from Clerk
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }
      Alert.alert("Transaction created successfully!");
      router.back();
    } catch (error) {
      console.error("Error creating transaction:", error);
      Alert.alert(
        "An error occurred while creating the transaction. Please try again."
      );
    } finally {
      setIsLoading(false);
      // Reset form fields
      setTitle("");
      setCategory(CATEGORIES[0].id);
      setPrice("");
      setIsExpense(true);
      // Navigate back to home
      router.push("/");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Transaction</Text>
        <TouchableOpacity
          style={[
            styles.saveButtonContainer,
            isLoading && styles.saveButtonDisabled,
          ]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          <Text style={styles.saveButton}>
            {isLoading ? "Saving..." : "Save"}
          </Text>
          {!isLoading && (
            <Ionicons name="checkmark" size={18} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.typeSelector}>
          {/* EXPENSE SELECTOR */}
          <TouchableOpacity
            style={[styles.typeButton, isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(true)}
          >
            <Ionicons
              name="arrow-down-circle"
              size={22}
              color={isExpense ? COLORS.white : COLORS.expense}
              style={styles.typeIcon}
            />
            <Text
              style={[
                styles.typeButtonText,
                isExpense && styles.typeButtonTextActive,
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>

          {/* income selector  */}
          <TouchableOpacity
            style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(false)}
          >
            <Ionicons
              name="arrow-up-circle"
              size={22}
              color={!isExpense ? COLORS.white : COLORS.income}
              style={styles.typeIcon}
            />
            <Text
              style={[
                styles.typeButtonText,
                !isExpense && styles.typeButtonTextActive,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* AMOUNT CONTAINER */}
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor={COLORS.textLight}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="create-outline"
            size={20}
            color={COLORS.textLight}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Transaction Title"
            placeholderTextColor={COLORS.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <Text style={styles.sectionTitle}>
          <Ionicons name="pricetag-outline" size={20} color={COLORS.text} />{" "}
          Category
        </Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((categoryy) => (
            <TouchableOpacity
              key={categoryy.id}
              style={[
                styles.categoryButton,
                category === categoryy.name && styles.categoryButtonActive,
              ]}
              onPress={() => setCategory(categoryy.name)}
            >
              <Ionicons
                name={categoryy.icon}
                size={20}
                color={category === categoryy.name ? COLORS.white : COLORS.text}
                style={styles.categoryIcon}
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  category === categoryy.name && styles.categoryButtonTextActive,
                ]}
              >
                {categoryy.name}
              </Text>
            </TouchableOpacity>

          ))}

        </View>

      </View>
        {
            isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            )
        }
    </View>
  );
};

export default Create;
