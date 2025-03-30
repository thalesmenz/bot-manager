'use client';
import { useState } from 'react';

interface Settings {
  apiKey: string;
  notifications: {
    email: boolean;
    telegram: boolean;
  };
  theme: 'dark' | 'light';
  language: 'pt' | 'en';
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    apiKey: 'sk-1234567890abcdef',
    notifications: {
      email: true,
      telegram: false,
    },
    theme: 'dark',
    language: 'pt',
  });

  const handleSave = () => {
    // Aqui você implementará a lógica para salvar as configurações
    console.log('Salvando configurações:', settings);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Salvar Alterações
        </button>
      </div>

      {/* API Settings */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Configurações da API</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">
              Chave da API
            </label>
            <div className="flex space-x-2">
              <input
                type="password"
                id="apiKey"
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200">
                Copiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Notificações</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-300">Notificações por Email</label>
              <p className="text-sm text-gray-400">Receber alertas importantes por email</p>
            </div>
            <button
              onClick={() => setSettings({
                ...settings,
                notifications: {
                  ...settings.notifications,
                  email: !settings.notifications.email
                }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                settings.notifications.email ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-300">Notificações no Telegram</label>
              <p className="text-sm text-gray-400">Receber alertas importantes no Telegram</p>
            </div>
            <button
              onClick={() => setSettings({
                ...settings,
                notifications: {
                  ...settings.notifications,
                  telegram: !settings.notifications.telegram
                }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                settings.notifications.telegram ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  settings.notifications.telegram ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Preferências</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Idioma
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value as 'pt' | 'en' })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pt">Português</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tema
            </label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'dark' | 'light' })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="dark">Escuro</option>
              <option value="light">Claro</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 