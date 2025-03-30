import api from './api';

interface SignUpData {
  email: string;
  password: string;
  name: string;
}

interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  async signUp(data: SignUpData) {
    const response = await api.post('/api/auth/register', data);
    const { token } = response.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    return response.data;
  },

  async signIn(data: SignInData) {
    const response = await api.post('/api/auth/login', data);
    const { token } = response.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    return response.data;
  },

  async signOut() {
    const response = await api.post('/api/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  },

  async getSession() {
    const response = await api.get('/api/auth/session');
    return response.data;
  },

  // Método para verificar se o usuário está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}; 