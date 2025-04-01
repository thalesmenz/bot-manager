'use client'

import { useState } from 'react';
import { Brain, Upload, FileText, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TrainingPage() {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleStartTraining = async () => {
    setIsTraining(true);
    // Simular progresso do treinamento
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(i);
    }
    setIsTraining(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Treinamento do Bot</h1>
          <p className="text-muted-foreground">Treine seu bot com dados personalizados</p>
        </div>
        <Button
          onClick={handleStartTraining}
          disabled={isTraining || files.length === 0}
          className="bg-primary hover:bg-primary/90 text-primary-foreground hover-glow"
        >
          {isTraining ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Treinando... {progress}%
            </div>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Iniciar Treinamento
            </>
          )}
        </Button>
      </div>

      {/* Upload Section */}
      <Card className="card-dark glass-effect card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Upload className="w-5 h-5" />
            Upload de Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Arraste e solte seus arquivos aqui ou{' '}
                  <span className="text-primary">clique para selecionar</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Formatos suportados: PDF, TXT, DOCX
                </p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Arquivos selecionados ({files.length})
                </h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-accent rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                        className="p-1 hover:bg-destructive/10 rounded-full text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Training Status */}
      <Card className="card-dark glass-effect card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Brain className="w-5 h-5" />
            Status do Treinamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Último Treinamento</h3>
                <p className="text-sm text-muted-foreground">
                  Concluído em 15/03/2024 às 14:30
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Próximo Treinamento</h3>
                <p className="text-sm text-muted-foreground">
                  Agendado para 20/03/2024 às 00:00
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground">Dados Processados</p>
                <p className="text-2xl font-bold text-primary">1.2GB</p>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold text-primary">45min</p>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground">Precisão</p>
                <p className="text-2xl font-bold text-primary">98%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 