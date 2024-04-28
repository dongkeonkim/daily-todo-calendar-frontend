import api from './api';

export const login = (username, password) =>
  api.post(`/login?username=${username}&password=${password}`);

export const info = () => api.get(`/users/info`);

export const join = (data) => api.post('/users', data);

export const update = (data) => api.put('/users', data);

export const remove = (userId) => api.delete(`/users/${userId}`);
