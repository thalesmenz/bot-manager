'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, botService } from '@/services/bot.service';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { 
  BotIcon, 
  Loader2, 
  QrCode, 
  Brain, 
  MessageSquare, 
  Users, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkle
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingQRCode, setLoadingQRCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [hasShownQR, setHasShownQR] = useState(false);

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
      if (qrCodeData.qrcode && !hasShownQR) {
        setShowQRModal(true);
        setHasShownQR(true);
      }
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="container mx-auto p-6 min-h-screen">
        <Card className="max-w-2xl mx-auto card-dark p-8 rounded-2xl animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkle className="w-8 h-8 text-blue-500" />
              <CardTitle className="text-3xl font-extrabold text-white">
                Bem-vindo ao MyBot
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-400 mb-8">
              Você ainda não tem um bot configurado. Crie seu primeiro bot para começar!
            </p>
            <Button 
              onClick={handleCreateBot}
              disabled={loading}
              className="btn-primary px-8 py-6 text-lg font-medium"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin mr-2" />
              ) : null}
              Criar Bot
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkle className="w-6 h-6 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          </div>
          <p className="text-gray-400">Bem-vindo de volta!</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/training')}
            className="btn-outline px-6 py-2"
          >
            <Brain className="w-5 h-5 mr-2" />
            Treinar Bot
          </Button>
          <Button
            variant={bot.status === 'active' ? 'destructive' : 'default'}
            onClick={handleToggleBotStatus}
            disabled={loading}
            className={`px-6 py-2 ${bot.status === 'active' ? 'btn-destructive' : 'btn-primary'}`}
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : bot.status === 'active' ? (
              'Desativar Bot'
            ) : (
              'Ativar Bot'
            )}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-dark p-6 rounded-xl hover:bg-gray-800/80 transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Usuários Ativos</p>
                <p className="text-2xl font-bold text-white mt-1">1,234</p>
                <div className="flex items-center text-green-500 text-sm mt-2">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12.5%
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-dark p-6 rounded-xl hover:bg-gray-800/80 transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Mensagens Hoje</p>
                <p className="text-2xl font-bold text-white mt-1">8,567</p>
                <div className="flex items-center text-green-500 text-sm mt-2">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +8.2%
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-dark p-6 rounded-xl hover:bg-gray-800/80 transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Taxa de Resposta</p>
                <p className="text-2xl font-bold text-white mt-1">98.5%</p>
                <div className="flex items-center text-red-500 text-sm mt-2">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  -0.5%
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-dark p-6 rounded-xl hover:bg-gray-800/80 transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Status do Bot</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {bot.status === 'active' ? 'Ativo' : 'Inativo'}
                </p>
                <div className="flex items-center text-sm mt-2">
                  <Badge variant={bot.status === 'active' ? 'default' : 'secondary'}>
                    {bot.status === 'active' ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <BotIcon className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="Escaneie o QR Code"
      >
        <div className="p-6 text-center">
          {loadingQRCode ? (
            <Loader2 size={32} className="animate-spin text-blue-500 mx-auto" />
          ) : qrCode ? (
            <img
              src={qrCode}
              alt="QR Code"
              className="mx-auto rounded-lg shadow-lg"
            />
          ) : (
            <p className="text-gray-400">QR Code não disponível</p>
          )}
        </div>
      </Modal>
    </div>
  );
}