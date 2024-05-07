import api from './api';

export const login = (username, password) =>
  api.post(`/login?username=${username}&password=${password}`);

export const info = () => api.get(`/member/info`);

export const join = (data) => api.post('/member/create', data);

export const update = (data) => api.put('/member', data);

export const remove = (userId) => api.delete(`/member/${userId}`);
