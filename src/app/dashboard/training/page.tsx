'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Robot, Brain, SpinnerGap } from '@phosphor-icons/react';
import { botService } from '@/services/bot.service';
import { authService } from '@/services/auth.service';

export default function Training() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [objectives, setObjectives] = useState('');
  const [trainingKey, setTrainingKey] = useState('');
  const [trainingData, setTrainingData] = useState('');

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
      const bot = await botService.getBot();
      if (bot) {
        setObjectives(bot.objectives || '');
        setTrainingKey(bot.training_key || '');
      }
    } catch (err) {
      setError('Erro ao carregar informações do bot');
      console.error('Erro ao carregar bot:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const bot = await botService.getBot();
      if (!bot) {
        setError('Bot não encontrado');
        return;
      }

      // Atualiza os objetivos
      if (objectives !== bot.objectives) {
        await botService.updateBotObjectives(objectives);
      }

      // Atualiza a chave de treinamento
      if (trainingKey !== bot.training_key) {
        await botService.updateBotTrainingKey(trainingKey);
      }

      // TODO: Implementar o envio dos dados de treinamento
      
      router.push('/dashboard');
    } catch (err) {
      setError('Erro ao salvar informações');
      console.error('Erro ao salvar:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <SpinnerGap size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between bg-white rounded-t-lg">
          <div className="flex items-center gap-4">
            <Brain size={32} className="text-blue-600" />
            <CardTitle className="text-gray-800">Treinamento do Bot</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Objetivos do Bot</label>
            <Textarea
              placeholder="Descreva os objetivos principais do seu bot..."
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-sm text-gray-500">
              Defina claramente o que você quer que seu bot faça e como ele deve se comportar.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Chave de Treinamento</label>
            <Input
              type="text"
              placeholder="Insira sua chave de API para treinamento..."
              value={trainingKey}
              onChange={(e) => setTrainingKey(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Esta chave é necessária para treinar seu bot usando IA.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Dados de Treinamento</label>
            <Textarea
              placeholder="Insira exemplos de conversas, respostas esperadas..."
              value={trainingData}
              onChange={(e) => setTrainingData(e.target.value)}
              className="min-h-[200px]"
            />
            <p className="text-sm text-gray-500">
              Forneça exemplos de conversas e respostas para treinar seu bot.
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="bg-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <SpinnerGap size={16} className="animate-spin mr-2" />
              ) : null}
              Salvar Treinamento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 