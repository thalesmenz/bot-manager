import { QrCode, SpinnerGap } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QRCodeCardProps {
  qrCode: string | null;
  loading: boolean;
}

export function QRCodeCard({ qrCode, loading }: QRCodeCardProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="bg-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <QrCode size={20} className="text-blue-600" />
          QR Code para Conectar
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white rounded-b-lg">
        <div className="flex flex-col items-center gap-4">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <SpinnerGap size={24} className="animate-spin text-blue-600" />
              <p className="text-gray-600 text-center">
                Gerando QR Code...
              </p>
            </div>
          ) : qrCode ? (
            <>
              <div className="bg-white p-4 rounded-lg shadow">
                <img 
                  src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
                  alt="QR Code para conexão do WhatsApp"
                  className="w-64 h-64 object-contain mx-auto"
                  style={{ 
                    maxWidth: '100%',
                    height: 'auto',
                    backgroundColor: 'white'
                  }}
                />
              </div>
              <div className="text-center space-y-2">
                <p className="text-gray-600">
                  Escaneie este QR Code com o WhatsApp para conectar seu bot
                </p>
                <p className="text-sm text-gray-500">
                  Se o QR Code expirar ou der erro ao escanear, aguarde que um novo será gerado automaticamente
                </p>
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-center">
              Aguarde alguns segundos para o QR Code aparecer...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 