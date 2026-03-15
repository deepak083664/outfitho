import api from './api';

const getAnalyticsData = async () => {
  try {
    const { data } = await api.get('/analytics');
    return data;
  } catch (error) {
    console.error("Error fetching real analytics:", error);
    throw error;
  }
};

export default { getAnalyticsData };
