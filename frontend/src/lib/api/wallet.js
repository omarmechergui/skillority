import api from '../apiClient';

export const walletApi = {
  getWallet: () => api.get('/wallet'),
  claimDailyLogin: () => api.post('/wallet/claim-daily', {}),
  claimAdReward: () => api.post('/wallet/claim-ad', {}),
};

export default walletApi;
