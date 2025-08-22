import axios from 'axios';
import { getToken } from '../utils/storage'; // Function to retrieve the user's token

export const getOwnerDashboardData = async () => {
  const token = getToken(); // Attempt to retrieve the stored token
  const response = await axios.get('http://localhost:5000/api/stores/owner/dashboard', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data; // Return the data structure you provided
};