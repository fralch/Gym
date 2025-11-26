import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext({});

const DNI_STORAGE_KEY = '@gym_user_dni';

export const UserProvider = ({ children }) => {
  const [dni, setDniState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDni();
  }, []);

  /**
   * Load DNI from AsyncStorage on mount
   */
  const loadDni = async () => {
    try {
      const storedDni = await AsyncStorage.getItem(DNI_STORAGE_KEY);
      if (storedDni) {
        setDniState(storedDni);
      }
    } catch (error) {
      console.error('Error loading DNI:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save DNI to state and AsyncStorage
   * @param {string} newDni - DNI to save
   */
  const setDni = async (newDni) => {
    try {
      if (newDni) {
        await AsyncStorage.setItem(DNI_STORAGE_KEY, newDni);
        setDniState(newDni);
      } else {
        await AsyncStorage.removeItem(DNI_STORAGE_KEY);
        setDniState(null);
      }
    } catch (error) {
      console.error('Error saving DNI:', error);
      throw error;
    }
  };

  /**
   * Clear DNI from state and AsyncStorage
   */
  const clearDni = async () => {
    try {
      await AsyncStorage.removeItem(DNI_STORAGE_KEY);
      setDniState(null);
    } catch (error) {
      console.error('Error clearing DNI:', error);
      throw error;
    }
  };

  const value = {
    dni,
    loading,
    setDni,
    clearDni,
    hasDni: !!dni,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
