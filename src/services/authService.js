import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

/**
 * Authentication Service
 * Handles token management and user authentication
 */
class AuthService {
  /**
   * Store authentication token
   * @param {string} token - JWT token from Sanctum
   */
  async setToken(token) {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  }

  /**
   * Get stored authentication token
   * @returns {Promise<string|null>} - JWT token or null
   */
  async getToken() {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Store user data
   * @param {object} userData - User information
   */
  async setUserData(userData) {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  }

  /**
   * Get stored user data
   * @returns {Promise<object|null>} - User data or null
   */
  async getUserData() {
    try {
      const data = await AsyncStorage.getItem('user_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Logout user and clear stored data
   */
  async logout() {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  /**
   * Login user (if you have a login endpoint)
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - Response with token and user data
   */
  async login(email, password) {
    try {
      const response = await api.post('/login', {
        email,
        password,
      });

      if (response.data.token) {
        await this.setToken(response.data.token);
        if (response.data.user) {
          await this.setUserData(response.data.user);
        }
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new AuthService();
