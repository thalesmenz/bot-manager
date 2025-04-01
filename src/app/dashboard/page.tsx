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
  ArrowDownRight
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
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-destructive font-medium">{error}</p>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="container mx-auto p-6 min-h-screen">
        <Card className="max-w-2xl mx-auto glass-effect card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <BotIcon size={24} className="text-primary" />
              Bem-vindo ao MyBots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Você ainda não tem um bot configurado. Crie seu primeiro bot para começar!
            </p>
            <Button 
              onClick={handleCreateBot}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground hover-glow"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : null}
              Criar Bot
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta!</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/training')}
            className="btn-outline"
          >
            <Brain className="w-4 h-4 mr-2" />
            Treinar Bot
          </Button>
          <Button
            variant={bot.status === 'active' ? 'destructive' : 'default'}
            onClick={handleToggleBotStatus}
            disabled={loading}
            className={bot.status === 'active' ? 'btn-destructive' : 'btn-primary'}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : bot.status === 'active' ? (
              'Desativar Bot'
            ) : (
              'Ativar Bot'
            )}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-dark glass-effect card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                <p className="text-2xl font-bold text-primary">1,234</p>
                <div className="flex items-center text-green-500 text-sm mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12.5%
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-dark glass-effect card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mensagens Hoje</p>
                <p className="text-2xl font-bold text-primary">8,567</p>
                <div className="flex items-center text-green-500 text-sm mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +8.2%
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-dark glass-effect card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Resposta</p>
                <p className="text-2xl font-bold text-primary">98.5%</p>
                <div className="flex items-center text-red-500 text-sm mt-1">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  -0.5%
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-dark glass-effect card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status do Bot</p>
                <p className="text-2xl font-bold text-primary">
                  {bot.status === 'active' ? 'Ativo' : 'Inativo'}
                </p>
                <Badge 
                  variant={bot.status === 'active' ? 'default' : 'destructive'}
                  className="mt-1"
                >
                  {bot.status === 'active' ? 'Online' : 'Offline'}
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <BotIcon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="Conecte seu WhatsApp"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-64 h-64 bg-white p-4 rounded-lg">
            {loadingQRCode ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : qrCode ? (
              <img
                src={qrCode}
                alt="QR Code para conexão do WhatsApp"
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                QR Code não disponível
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Abra o WhatsApp no seu celular e escaneie o QR Code para conectar seu bot
          </p>
          <Button
            onClick={() => setShowQRModal(false)}
            className="w-full btn-primary"
          >
            Fechar
          </Button>
        </div>
      </Modal>
    </div>
  );
} 