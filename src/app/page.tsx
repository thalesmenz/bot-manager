'use client';

import Link from 'next/link';
import { Robot, WhatsappLogo, Brain, ChartLineUp, ArrowRight, Sparkle } from '@phosphor-icons/react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header/Navbar */}
      <nav className="glass-effect fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkle className="w-6 h-6 text-blue-500" weight="fill" />
                MyBot
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-primary px-4 py-2 rounded-md text-sm font-medium"
              >
                Começar Grátis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
              Automatize seu WhatsApp com{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-gradient">
                Inteligência Artificial
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Transforme seu atendimento com bots inteligentes que entendem e respondem
              naturalmente, aumentando sua produtividade e satisfação dos clientes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register"
                className="btn-primary px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 group"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="btn-outline px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center"
              >
                Saiba Mais
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Por que escolher o MyBot?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Robot className="w-8 h-8" weight="duotone" />}
              title="Automação Inteligente"
              description="Automatize respostas com IA avançada que entende o contexto das conversas."
            />
            <FeatureCard
              icon={<WhatsappLogo className="w-8 h-8" weight="duotone" />}
              title="Multi-WhatsApp"
              description="Gerencie múltiplos números de WhatsApp em uma única plataforma."
            />
            <FeatureCard
              icon={<Brain className="w-8 h-8" weight="duotone" />}
              title="IA Treinável"
              description="Treine seu bot para responder de acordo com seu negócio."
            />
            <FeatureCard
              icon={<ChartLineUp className="w-8 h-8" weight="duotone" />}
              title="Analytics Detalhado"
              description="Acompanhe métricas e desempenho em tempo real."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="card-dark p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">
              Pronto para revolucionar seu atendimento?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Comece agora mesmo e veja a diferença que o MyBot pode fazer para seu negócio.
            </p>
            <Link
              href="/register"
              className="btn-primary px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center gap-2 group"
            >
              Criar Conta Grátis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800/30 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 MyBot. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card-dark p-6 rounded-xl hover:bg-gray-800/80 transition-all duration-300">
      <div className="text-blue-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
