import api from '../apiClient.js';

export const walletApi = {
  getWallet: () => api.get('/wallet'),
  claimDailyLogin: () => api.post('/wallet/claim-daily-login', {}),
  claimAdReward: () => api.post('/wallet/claim-ad-reward', {}),
};

export default walletApi;
