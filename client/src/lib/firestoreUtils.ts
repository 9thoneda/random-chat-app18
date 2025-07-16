import { doc, getDoc, updateDoc, increment, runTransaction } from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * Get the current coin balance for a user
 * @param uid - User ID
 * @returns Promise<number> - Current coin balance
 */
export async function getCoins(uid: string): Promise<number> {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData.coins || 0;
    } else {
      console.warn(`User document not found for uid: ${uid}`);
      return 0;
    }
  } catch (error) {
    console.error("Error getting coins:", error);
    throw new Error("Failed to fetch coin balance");
  }
}

/**
 * Add coins to a user's balance
 * @param uid - User ID
 * @param amount - Amount of coins to add (must be positive)
 * @returns Promise<number> - New coin balance
 */
export async function addCoins(uid: string, amount: number): Promise<number> {
  if (amount <= 0) {
    throw new Error("Amount must be positive");
  }

  try {
    const userDocRef = doc(db, "users", uid);
    
    // Use a transaction to safely add coins and return the new balance
    const newBalance = await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error("User document not found");
      }
      
      const currentCoins = userDoc.data().coins || 0;
      const newCoins = currentCoins + amount;
      
      transaction.update(userDocRef, {
        coins: newCoins,
        updatedAt: new Date()
      });
      
      return newCoins;
    });
    
    console.log(`Added ${amount} coins to user ${uid}. New balance: ${newBalance}`);
    return newBalance;
  } catch (error) {
    console.error("Error adding coins:", error);
    throw new Error("Failed to add coins");
  }
}

/**
 * Spend coins from a user's balance (only if sufficient balance exists)
 * @param uid - User ID
 * @param amount - Amount of coins to spend (must be positive)
 * @returns Promise<{ success: boolean; newBalance: number; message: string }>
 */
export async function spendCoins(uid: string, amount: number): Promise<{
  success: boolean;
  newBalance: number;
  message: string;
}> {
  if (amount <= 0) {
    return {
      success: false,
      newBalance: 0,
      message: "Amount must be positive"
    };
  }

  try {
    const userDocRef = doc(db, "users", uid);
    
    const result = await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      
      if (!userDoc.exists()) {
        return {
          success: false,
          newBalance: 0,
          message: "User document not found"
        };
      }
      
      const currentCoins = userDoc.data().coins || 0;
      
      if (currentCoins < amount) {
        return {
          success: false,
          newBalance: currentCoins,
          message: `Insufficient coins. You have ${currentCoins} coins but need ${amount}`
        };
      }
      
      const newCoins = currentCoins - amount;
      
      transaction.update(userDocRef, {
        coins: newCoins,
        updatedAt: new Date()
      });
      
      return {
        success: true,
        newBalance: newCoins,
        message: `Successfully spent ${amount} coins`
      };
    });
    
    if (result.success) {
      console.log(`Spent ${amount} coins for user ${uid}. New balance: ${result.newBalance}`);
    } else {
      console.warn(`Failed to spend coins for user ${uid}: ${result.message}`);
    }
    
    return result;
  } catch (error) {
    console.error("Error spending coins:", error);
    return {
      success: false,
      newBalance: 0,
      message: "Failed to spend coins due to an error"
    };
  }
}

/**
 * Initialize coins for a user (sets to 100 if not already set)
 * @param uid - User ID
 * @returns Promise<number> - Initial coin balance
 */
export async function initializeCoins(uid: string): Promise<number> {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      
      // If coins field doesn't exist, initialize it to 100
      if (userData.coins === undefined) {
        await updateDoc(userDocRef, {
          coins: 100,
          updatedAt: new Date()
        });
        console.log(`Initialized coins to 100 for user ${uid}`);
        return 100;
      }
      
      return userData.coins;
    } else {
      console.warn(`User document not found for uid: ${uid}`);
      return 0;
    }
  } catch (error) {
    console.error("Error initializing coins:", error);
    throw new Error("Failed to initialize coins");
  }
}