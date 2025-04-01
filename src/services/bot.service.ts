import api from './api';
import { AxiosError } from 'axios';

export interface BotData {
  status?: 'active' | 'inactive';
}

export interface Bot extends BotData {
  id: string;
  user_id: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface QRCodeResponse {
  qrcode: string;
}

export interface BotStatus {
  isRunning: boolean;
  status: 'active' | 'inactive';
  lastUpdate: string;
}

class BotService {
  async createBot(): Promise<Bot> {
    const response = await api.post<Bot>('/api/bots');
    return response.data;
  }

  async getBot(): Promise<Bot | null> {
    try {
      const response = await api.get<Bot[]>('/api/bots');
      return response.data[0] || null;
    } catch (error) {
      console.error('Erro ao buscar bot:', error);
      if ((error as AxiosError)?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async updateBotStatus(status: 'active' | 'inactive'): Promise<Bot> {
    try {
      const bot = await this.getBot();
      if (!bot) {
        throw new Error('Bot não encontrado');
      }

      console.log('Atualizando status do bot:', { botId: bot.id, status });
      const response = await api.put<Bot>(`/api/bots/${bot.id}/status`, { status });
      console.log('Resposta da atualização:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar status do bot:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Erro ao atualizar status do bot');
      }
      throw new Error('Erro ao comunicar com o servidor');
    }
  }

  async getBotStatus(): Promise<BotStatus> {
    const bot = await this.getBot();
    if (!bot) {
      throw new Error('Bot não encontrado');
    }

    const response = await api.get<BotStatus>(`/api/bots/${bot.id}/status`);
    return response.data;
  }

  async deleteBot(id: string): Promise<void> {
    await api.delete(`/api/bots/${id}`);
  }

  async getQRCode(): Promise<QRCodeResponse> {
    try {
      const bot = await this.getBot();
      if (!bot) {
        throw new Error('Bot não encontrado');
      }

      const response = await api.get(`/api/bots/qrcode/${bot.id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter QR code:', error);
      throw error;
    }
  }
}

export const botService = new BotService(); 