'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, botService } from '@/services/bot.service';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Robot, SpinnerGap, QrCode, Brain } from '@phosphor-icons/react';
import { QRCodeCard } from '@/components/dashboard/QRCodeCard';

export default function Dashboard() {
  const router = useRouter();
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingQRCode, setLoadingQRCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }
      loadBot();
    };

    checkAuth();
  }, [router]);

  const loadBot = async () => {
    try {
      setLoading(true);
      const botData = await botService.getBot();
      setBot(botData);
    } catch (err) {
      setError('Erro ao carregar informações do bot');
      console.error('Erro ao carregar bot:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadQRCode = async () => {
    try {
      setLoadingQRCode(true);
      const qrCodeData = await botService.getQRCode();
      setQrCode(qrCodeData.qrcode || null);
    } catch (err) {
      console.error('Erro ao carregar QR code:', err);
    } finally {
      setLoadingQRCode(false);
    }
  };

  const handleToggleBotStatus = async () => {
    if (!bot) return;

    try {
      setLoading(true);
      const newStatus = bot.status === 'active' ? 'inactive' : 'active';
      const updatedBot = await botService.updateBotStatus(newStatus);
      setBot(updatedBot);
      
      if (newStatus === 'active') {
        loadQRCode();
      } else {
        setQrCode(null);
      }
    } catch (err) {
      setError('Erro ao alterar status do bot');
      console.error('Erro ao alterar status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBot = async () => {
    try {
      setLoading(true);
      const newBot = await botService.createBot();
      setBot(newBot);
    } catch (err) {
      setError('Erro ao criar bot');
      console.error('Erro ao criar bot:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <SpinnerGap size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Robot size={24} className="text-blue-600" />
              Bem-vindo ao MyBots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Você ainda não tem um bot configurado. Crie seu primeiro bot para começar!
            </p>
            <Button 
              onClick={handleCreateBot}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <SpinnerGap size={16} className="animate-spin mr-2" />
              ) : null}
              Criar Bot
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Cabeçalho do Bot */}
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between bg-white rounded-t-lg">
          <div className="flex items-center gap-4">
            <Robot size={32} className="text-blue-600" />
            <CardTitle className="text-gray-800">Gerenciamento do Bot</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/training')}
              className="bg-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              Treinar Bot
            </Button>
            <Button
              variant={bot.status === 'active' ? 'destructive' : 'default'}
              onClick={handleToggleBotStatus}
              disabled={loading}
              className={bot.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
            >
              {loading ? (
                <SpinnerGap size={16} className="animate-spin" />
              ) : bot.status === 'active' ? (
                'Desativar Bot'
              ) : (
                'Ativar Bot'
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* QR Code */}
      {bot.status === 'active' && (
        <QRCodeCard qrCode={qrCode} loading={loadingQRCode} />
      )}
    </div>
  );
} 