import api from './api';

export const login = (email, password) =>
  api.post('/auth/login', {
    email: email,
    password: password,
  });

export const info = () => api.get(`/member/info`);

export const join = (data) => api.post('/member/create', data);

export const update = (data) => api.put('/member/update', data);

export const remove = (data) => api.put('/member/delete', data);
