import api from '../apiClient.js';

export const walletApi = {
  getWallet: () => api.get('/wallet'),
  getPackages: () => api.get('/wallet/packages'),
  getDailyMissions: () => api.get('/wallet/missions'),
  claimDailyMission: (missionId) => api.post(`/wallet/missions/${missionId}/claim`, {}),
  claimDailyLogin: () => api.post('/wallet/claim-daily-login', {}),
  initiateAdSession: () => api.post('/wallet/ad-session/initiate', {}),
  claimAdReward: (adSessionToken) => api.post('/wallet/claim-ad-reward', { adSessionToken }),
};

export default walletApi;
