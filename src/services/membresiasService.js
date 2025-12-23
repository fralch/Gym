import api from './api';

/**
 * Membresías (Memberships) Service
 * Handles all membership-related API calls
 */
class MembresiasService {
  /**
   * Get list of memberships
   * @param {object} filters - Optional filters
   * @param {number} filters.id_usuario - Filter by member ID
   * @param {string} filters.estado - Filter by status (Activa/Inactiva)
   * @returns {Promise<object>} - List of memberships
   */
  async getAll(filters = {}) {
    try {
      const response = await api.get('/gimnasio/membresias', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching memberships:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get a specific membership by ID
   * @param {number} id_membresia - Membership ID
   * @returns {Promise<object>} - Membership details
   */
  async getById(id_membresia) {
    try {
      const response = await api.get(`/gimnasio/membresias/${id_membresia}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching membership:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Create a new membership
   * @param {object} membershipData - Membership information
   * @param {number} membershipData.id_usuario - Member ID
   * @param {string} membershipData.tipo_plan - Plan type (e.g., "Mensual", "Trimestral", "Anual")
   * @param {string} membershipData.fecha_inicio - Start date (YYYY-MM-DD)
   * @param {string} membershipData.fecha_fin - End date (YYYY-MM-DD)
   * @param {string} membershipData.estado - Status (Activa/Inactiva)
   * @returns {Promise<object>} - Created membership
   */
  async create(membershipData) {
    try {
      const response = await api.post('/gimnasio/membresias', membershipData);
      return response.data;
    } catch (error) {
      console.error('Error creating membership:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Update an existing membership
   * @param {number} id_membresia - Membership ID
   * @param {object} membershipData - Membership information to update
   * @returns {Promise<object>} - Updated membership
   */
  async update(id_membresia, membershipData) {
    try {
      const response = await api.put(`/gimnasio/membresias/${id_membresia}`, membershipData);
      return response.data;
    } catch (error) {
      console.error('Error updating membership:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Delete a membership
   * @param {number} id_membresia - Membership ID
   * @returns {Promise<object>} - Success response
   */
  async delete(id_membresia) {
    try {
      const response = await api.delete(`/gimnasio/membresias/${id_membresia}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting membership:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get active membership for a user
   * @param {number} id_usuario - Member ID
   * @returns {Promise<object|null>} - Active membership or null
   */
  async getActiveMembership(id_usuario) {
    try {
      const response = await this.getAll({ id_usuario, estado: 'Activa' });
      if (response.success && response.data.length > 0) {
        // Return the first active membership
        return response.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching active membership:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new MembresiasService();
