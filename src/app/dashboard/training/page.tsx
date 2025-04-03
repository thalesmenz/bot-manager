'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TrainingData } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import trainingService from '@/services/training.service';
import { botService, Bot } from '@/services/bot.service';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Bot as BotIcon, Clock, User, Link as LinkIcon, DollarSign, Settings } from 'lucide-react';

const trainingSchema = z.object({
  botName: z.string().min(1, 'Nome do bot é obrigatório'),
  price: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  attendanceMode: z.string().min(1, 'Modo de atendimento é obrigatório'),
  serviceName: z.string().min(1, 'Nome do serviço é obrigatório'),
  actionLink: z.string().url('Link inválido'),
  userName: z.string().min(1, 'Nome do usuário é obrigatório'),
});

type TrainingFormData = z.infer<typeof trainingSchema>;

export default function TrainingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [training, setTraining] = useState<TrainingData | null>(null);
  const [bot, setBot] = useState<Bot | null>(null);
  const [isLoadingBot, setIsLoadingBot] = useState(true);

  useEffect(() => {
    loadBot();
  }, []);

  const loadBot = async () => {
    try {
      setIsLoadingBot(true);
      const botData = await botService.getBot();
      setBot(botData);
      if (botData) {
        const trainings = await trainingService.getAll(botData.id);
        if (trainings.length > 0) {
          setTraining(trainings[0]);
          // Preencher o formulário com os dados existentes
          setValue('botName', trainings[0].bot_name || '');
          setValue('price', trainings[0].price || 0);
          setValue('attendanceMode', trainings[0].attendance_mode || '');
          setValue('serviceName', trainings[0].service_name || '');
          setValue('actionLink', trainings[0].action_link || '');
          setValue('userName', trainings[0].user_name || '');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar bot:', error);
      toast.error('Erro ao carregar dados do bot');
    } finally {
      setIsLoadingBot(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema),
  });

  const onSubmit = async (data: TrainingFormData) => {
    if (!training?.id || !bot?.id) {
      toast.error('Treinamento não encontrado');
      return;
    }

    try {
      setIsLoading(true);
      const response = await trainingService.update(training.id, {
        bot_name: data.botName,
        price: data.price,
        attendance_mode: data.attendanceMode,
        service_name: data.serviceName,
        action_link: data.actionLink,
        user_name: data.userName
      });
      
      // Atualiza o estado com os novos dados
      setTraining({
        ...response,
        bot_name: data.botName,
        price: data.price,
        attendance_mode: data.attendanceMode,
        service_name: data.serviceName,
        action_link: data.actionLink,
        user_name: data.userName
      });
      
      toast.success('Treinamento atualizado com sucesso!');
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/login');
        return;
      }
      toast.error(error.response?.data?.error || 'Erro ao atualizar treinamento');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingBot) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-100 mb-4">Nenhum bot encontrado</h2>
          <p className="text-zinc-400">Crie um bot primeiro para configurar o treinamento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Header com Status do Bot */}
          <div className="bg-zinc-800 rounded-lg p-6 mb-6 border border-zinc-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <BotIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-zinc-100">Treinamento do Bot</h1>
                  <p className="text-zinc-400">Configure as respostas e comportamentos do seu bot</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Treinamento */}
          <Card className="p-6 mb-6 bg-zinc-800 border-zinc-700">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-zinc-100">Configurações do Treinamento</h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="botName" className="text-zinc-300">Nome do Bot</Label>
                  <Input
                    id="botName"
                    {...register('botName')}
                    placeholder="Nome do bot"
                    className="bg-zinc-900 border-zinc-700 text-zinc-100"
                  />
                  {errors.botName && (
                    <p className="text-sm text-red-400">{errors.botName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-zinc-300">Preço do Serviço</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
                    <Input
                      id="price"
                      type="number"
                      {...register('price', { valueAsNumber: true })}
                      placeholder="0.00"
                      className="pl-9 bg-zinc-900 border-zinc-700 text-zinc-100"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-sm text-red-400">{errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attendanceMode" className="text-zinc-300">Modo de Atendimento</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
                    <Input
                      id="attendanceMode"
                      {...register('attendanceMode')}
                      placeholder="Ex: 24h, 8h, etc"
                      className="pl-9 bg-zinc-900 border-zinc-700 text-zinc-100"
                    />
                  </div>
                  {errors.attendanceMode && (
                    <p className="text-sm text-red-400">{errors.attendanceMode.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceName" className="text-zinc-300">Nome do Serviço</Label>
                  <Input
                    id="serviceName"
                    {...register('serviceName')}
                    placeholder="Ex: Suporte Técnico"
                    className="bg-zinc-900 border-zinc-700 text-zinc-100"
                  />
                  {errors.serviceName && (
                    <p className="text-sm text-red-400">{errors.serviceName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actionLink" className="text-zinc-300">Link de Ação</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
                    <Input
                      id="actionLink"
                      {...register('actionLink')}
                      placeholder="https://..."
                      className="pl-9 bg-zinc-900 border-zinc-700 text-zinc-100"
                    />
                  </div>
                  {errors.actionLink && (
                    <p className="text-sm text-red-400">{errors.actionLink.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userName" className="text-zinc-300">Nome do Atendente</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
                    <Input
                      id="userName"
                      {...register('userName')}
                      placeholder="Nome do atendente"
                      className="pl-9 bg-zinc-900 border-zinc-700 text-zinc-100"
                    />
                  </div>
                  {errors.userName && (
                    <p className="text-sm text-red-400">{errors.userName.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
