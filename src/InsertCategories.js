import { database } from "./firebase";
import { ref, push } from "firebase/database";

const insertDefaultCategories = async () => {
  const categoriesRef = ref(database, "categories/");

  const defaultCategories = [
    { name: "Food", icon: "🍔", type: "expense", userId: null },
    { name: "Rent", icon: "🏠", type: "expense", userId: null },
    { name: "Salary", icon: "💵", type: "income", userId: null },
    { name: "Bonus", icon: "🎁", type: "income", userId: null },
  ];

  try {
    for (const category of defaultCategories) {
      await push(categoriesRef, category);
    }
    console.log("Default categories inserted successfully!");
  } catch (error) {
    console.error("Error inserting default categories:", error);
  }
};

insertDefaultCategories();
