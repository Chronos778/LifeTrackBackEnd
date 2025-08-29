import axios from 'axios';

const API_BASE_URL = 'https://lifetrackbackend-production.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions to interact with your Flask backend
export const apiService = {
  // Get all users
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  },

  // Get all doctors
  getDoctors: async () => {
    try {
      const response = await api.get('/doctors');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch doctors');
    }
  },

  // Get doctors visited by a specific user
  getDoctorsVisitedByUser: async (userId) => {
    try {
      const [doctors, records] = await Promise.all([
        api.get('/doctors'),
        api.get('/health_records')
      ]);
      
      // Get unique doctor IDs from user's health records
      const userRecords = records.data.filter(record => record.user_id === userId);
      const visitedDoctorIds = [...new Set(userRecords.map(record => record.doctor_id))];
      
      // Filter doctors to only show visited ones
      const visitedDoctors = doctors.data.filter(doctor => 
        visitedDoctorIds.includes(doctor.doctor_id)
      );
      
      return visitedDoctors;
    } catch (error) {
      throw new Error('Failed to fetch visited doctors');
    }
  },

  // Get all health records
  getHealthRecords: async () => {
    try {
      const response = await api.get('/health_records');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch health records');
    }
  },

  // Get health records for a specific user
  getUserHealthRecords: async (userId) => {
    try {
      const response = await api.get('/health_records');
      const userRecords = response.data.filter(record => record.user_id === userId);
      
      // Sort by date (most recent first)
      userRecords.sort((a, b) => new Date(b.record_date) - new Date(a.record_date));
      
      return userRecords;
    } catch (error) {
      throw new Error('Failed to fetch user health records');
    }
  },

  // Get all treatments
  getTreatments: async () => {
    try {
      const response = await api.get('/treatment');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch treatments');
    }
  },

  // Get treatments for a specific user
  getUserTreatments: async (userId) => {
    try {
      const [treatments, records] = await Promise.all([
        api.get('/treatment'),
        api.get('/health_records')
      ]);
      
      // Get user's health record IDs
      const userRecords = records.data.filter(record => record.user_id === userId);
      const userRecordIds = userRecords.map(record => record.record_id);
      
      // Filter treatments to only show user's treatments
      const userTreatments = treatments.data.filter(treatment => 
        userRecordIds.includes(treatment.record_id)
      );
      
      return userTreatments;
    } catch (error) {
      throw new Error('Failed to fetch user treatments');
    }
  },

  // Get treatment history with related record info for a user
  getUserTreatmentHistory: async (userId) => {
    try {
      const [treatments, records, doctors] = await Promise.all([
        api.get('/treatment'),
        api.get('/health_records'),
        api.get('/doctors')
      ]);
      
      // Get user's health records
      const userRecords = records.data.filter(record => record.user_id === userId);
      const userRecordIds = userRecords.map(record => record.record_id);
      
      // Get user's treatments with related record info
      const userTreatments = treatments.data
        .filter(treatment => userRecordIds.includes(treatment.record_id))
        .map(treatment => {
          const relatedRecord = userRecords.find(record => record.record_id === treatment.record_id);
          const doctor = doctors.data.find(doc => doc.doctor_id === relatedRecord?.doctor_id);
          
          return {
            ...treatment,
            diagnosis: relatedRecord?.diagnosis,
            record_date: relatedRecord?.record_date,
            doctor_name: doctor?.name || 'Unknown Doctor',
            doctor_specialization: doctor?.specialization
          };
        });
      
      // Sort by record date (most recent first)
      userTreatments.sort((a, b) => new Date(b.record_date) - new Date(a.record_date));
      
      return userTreatments;
    } catch (error) {
      throw new Error('Failed to fetch user treatment history');
    }
  },

  // Login function - validates user credentials
  login: async (email, password) => {
    try {
      const users = await api.get('/users');
      const user = users.data.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Don't send password back to frontend
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        throw error;
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  // POST methods for adding new data
  addHealthRecord: async (recordData) => {
    try {
      const response = await api.post('/health_records', recordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add health record');
    }
  },

  addTreatment: async (treatmentData) => {
    try {
      const response = await api.post('/treatment', treatmentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add treatment');
    }
  },

  addDoctor: async (doctorData) => {
    try {
      const response = await api.post('/doctors', doctorData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add doctor');
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to register user');
    }
  },

  // DELETE methods for removing data
  deleteHealthRecord: async (recordId) => {
    try {
      const response = await api.delete(`/health_records/${recordId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete health record');
    }
  },

  deleteTreatment: async (treatmentId) => {
    try {
      const response = await api.delete(`/treatment/${treatmentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete treatment');
    }
  },

  deleteDoctor: async (doctorId) => {
    try {
      const response = await api.delete(`/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete doctor');
    }
  }
};

export default apiService;
