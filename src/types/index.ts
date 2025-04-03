export interface Bot {
  id: string;
  status: 'active' | 'inactive';
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface TrainingData {
  id?: string;
  botId: string;
  botName?: string;
  price?: number;
  attendanceMode?: string;
  serviceName?: string;
  actionLink?: string;
  userName?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SocketEvents {
  botStatusChanged: {
    userId: string;
    status: 'active' | 'inactive';
  };
  qrCodeGenerated: {
    userId: string;
    qrcode: string;
  };
} 