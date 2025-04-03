import api from './api';
import { TrainingData } from '@/types';

class TrainingService {
  private readonly baseUrl = '/api/training';

  async getAll(botId: string): Promise<TrainingData[]> {
    try {
      const response = await api.get<TrainingData[]>(`${this.baseUrl}/bot/${botId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar treinamentos:', error);
      throw new Error('Erro ao buscar treinamentos');
    }
  }

  async create(trainingData: Omit<TrainingData, 'id' | 'created_at' | 'updated_at'>): Promise<TrainingData> {
    try {
      const response = await api.post<TrainingData>(this.baseUrl, trainingData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar treinamento:', error);
      throw new Error('Erro ao criar treinamento');
    }
  }

  async getById(id: string): Promise<TrainingData> {
    try {
      const response = await api.get<TrainingData>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar treinamento:', error);
      throw new Error('Erro ao buscar treinamento');
    }
  }

  async update(id: string, trainingData: Partial<TrainingData>): Promise<TrainingData> {
    try {
      const response = await api.patch<TrainingData>(`${this.baseUrl}/${id}`, trainingData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar treinamento:', error);
      throw new Error('Erro ao atualizar treinamento');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar treinamento:', error);
      throw new Error('Erro ao deletar treinamento');
    }
  }

  async startTraining(id: string): Promise<TrainingData> {
    try {
      const response = await api.post<TrainingData>(`${this.baseUrl}/${id}/start`);
      return response.data;
    } catch (error) {
      console.error('Erro ao iniciar treinamento:', error);
      throw new Error('Erro ao iniciar treinamento');
    }
  }

  async stopTraining(id: string): Promise<TrainingData> {
    try {
      const response = await api.post<TrainingData>(`${this.baseUrl}/${id}/stop`);
      return response.data;
    } catch (error) {
      console.error('Erro ao parar treinamento:', error);
      throw new Error('Erro ao parar treinamento');
    }
  }
}

export default new TrainingService(); 