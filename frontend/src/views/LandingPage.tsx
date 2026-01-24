'use client';

import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

// Minimal, elegant icons
const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const QuoteIcon = () => (
  <svg className="w-8 h-8 text-emerald-500/20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

const features = [
  {
    title: 'Gestão de Pedidos',
    description: 'Controle completo do fluxo de trabalho, desde a entrada até a entrega final.',
    accent: 'emerald',
  },
  {
    title: 'CRM Inteligente',
    description: 'Conheça seus clientes, histórico de pedidos e preferências em um só lugar.',
    accent: 'blue',
  },
  {
    title: 'Relatórios em Tempo Real',
    description: 'Métricas de vendas, receita e performance sempre atualizadas.',
    accent: 'violet',
  },
  {
    title: 'Logística Integrada',
    description: 'Rotas otimizadas e rastreamento para suas entregas.',
    accent: 'amber',
  },
  {
    title: 'WhatsApp & SMS',
    description: 'Notificações automáticas que mantêm seus clientes informados.',
    accent: 'rose',
  },
  {
    title: 'Pagamentos',
    description: 'Integração completa com as principais bandeiras e Pix.',
    accent: 'cyan',
  },
];

const testimonials = [
  {
    name: 'Maria Santos',
    role: 'Lavanderia Express',
    quote: 'Reduzimos erros em 80% e a equipe ficou mais produtiva. A diferença foi imediata.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
    initials: 'MS',
  },
  {
    name: 'Carlos Oliveira',
    role: 'Rede CleanWash',
    quote: 'Gerenciar 5 unidades ficou simples. Os relatórios me dão visão completa do negócio.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80',
    initials: 'CO',
  },
  {
    name: 'Ana Paula',
    role: 'LaundryPro',
    quote: 'Nossos clientes adoram as notificações. O atendimento melhorou muito.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80',
    initials: 'AP',
  },
];

const stats = [
  { value: '500+', label: 'Lavanderias' },
  { value: '2M+', label: 'Pedidos/mês' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9', label: 'Avaliação' },
];

const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If user is already logged in, redirect to dashboard
  // NOTE: This must be placed AFTER all hooks to follow React's rules of hooks
  if (user) {
    return <Navigate to="/stores/dashboard/overview" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased transition-colors duration-300">
      {/* Navigation - Clean, minimal */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                Lavatec
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {['Recursos', 'Preços', 'Clientes'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200"
              >
                Começar grátis
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="px-6 py-4 space-y-1">
              {['Recursos', 'Preços', 'Clientes'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-4 py-3 text-slate-600 dark:text-slate-400 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <Link to="/login" className="text-center px-4 py-3 text-slate-600 dark:text-slate-400 font-medium border border-slate-200 dark:border-slate-700 rounded-lg">
                  Entrar
                </Link>
                <Link to="/register" className="text-center px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg">
                  Começar grátis
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Editorial, asymmetric */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=1600&h=900&fit=crop&q=80" 
            alt="Lavanderia moderna e organizada"
            className="w-full h-full object-cover opacity-10 dark:opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/98 via-white/95 to-white dark:from-slate-950/98 dark:via-slate-950/95 dark:to-slate-950" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-40 right-0 w-96 h-96 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-50 z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30 z-10" />

        <div className="relative max-w-6xl mx-auto px-6 z-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Usado por +500 lavanderias no Brasil
            </div>

            {/* Main headline - Large, editorial */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6">
              Simplifique a gestão da sua
              <span className="relative">
                <span className="relative z-10 text-emerald-600 dark:text-emerald-400"> lavanderia</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-200 dark:text-emerald-800" viewBox="0 0 200 12" fill="currentColor" preserveAspectRatio="none">
                  <path d="M0 12 Q50 0 100 6 T200 4 V12 Z" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-2xl">
              Uma plataforma completa para gerenciar pedidos, clientes, entregas e finanças. 
              Menos planilhas, mais resultados.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-16">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40"
              >
                Começar gratuitamente
                <ArrowRightIcon />
              </Link>
              <a
                href="#demo"
                className="group inline-flex items-center gap-2 px-6 py-3.5 text-slate-700 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <span className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-md group-hover:shadow-lg transition-shadow">
                  <PlayIcon />
                </span>
                Ver demonstração
              </a>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard preview - Floating, modern */}
          <div className="hidden lg:block absolute top-32 right-0 w-[500px] transform translate-x-12">
            <div className="relative">
              {/* Main card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-200/50 dark:border-slate-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">Dashboard</span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                      <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">Hoje</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">42</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-3">
                      <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">Receita</p>
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">R$ 2.840</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                      <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">Novos</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">8</p>
                    </div>
                  </div>
                  {/* Order list */}
                  <div className="space-y-2">
                    {[
                      { name: 'Maria S.', status: 'Pronto', color: 'emerald' },
                      { name: 'João O.', status: 'Lavando', color: 'amber' },
                      { name: 'Ana P.', status: 'Entrega', color: 'blue' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
                            {item.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.color === 'emerald' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          item.color === 'amber' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating notification */}
              <div className="absolute -left-16 top-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-3 flex items-center gap-3 border border-slate-100 dark:border-slate-700">
                <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                  <CheckIcon />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-900 dark:text-white">Pedido finalizado</p>
                  <p className="text-xs text-slate-500">Agora mesmo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos/Trust Section */}
      <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs uppercase tracking-wider text-slate-400 dark:text-slate-600 mb-8 font-medium">
            Empresas que confiam no Lavatec
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
            {['CleanWash', 'LaundryPro', 'Express Lav', 'LavaTudo', 'Fast Clean'].map((name, i) => (
              <span key={i} className="text-xl font-bold text-slate-400 dark:text-slate-600">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Showcase Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Text */}
            <div>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4 block">
                Interface Intuitiva
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                Gestão visual e prática
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                Interface limpa e moderna que sua equipe aprende em minutos. Acompanhe pedidos, estoque e finanças de forma visual.
              </p>
              <ul className="space-y-3">
                {['Dashboard em tempo real', 'Controle de pedidos visual', 'Relatórios automáticos'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80" 
                  alt="Dashboard Lavatec - Gestão de pedidos"
                  className="w-full h-auto"
                />
              </div>
              {/* Floating stats */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+80%</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Produtividade</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image - Order */}
            <div className="order-2 lg:order-1 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&q=80" 
                  alt="Gestão de clientes Lavatec"
                  className="w-full h-auto"
                />
              </div>
              {/* Floating notification */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl px-4 py-3 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-sm font-medium text-slate-900 dark:text-white">Cliente notificado</p>
              </div>
            </div>
            {/* Text */}
            <div className="order-1 lg:order-2">
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4 block">
                Comunicação Automática
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                Mantenha clientes sempre informados
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                Notificações automáticas por WhatsApp, SMS e email em cada etapa do pedido. Seus clientes sempre sabem o status.
              </p>
              <ul className="space-y-3">
                {['WhatsApp integrado', 'SMS automático', 'Email personalizado'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento grid style */}
      <section id="recursos" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <div className="max-w-2xl mb-16">
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4 block">
              Recursos
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
              Tudo que você precisa, nada que você não precisa
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Ferramentas poderosas e intuitivas para gerenciar cada aspecto da sua operação.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 ${
                  index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                }`}
              >
                {/* Accent dot */}
                <div className={`w-2 h-2 rounded-full mb-4 ${
                  feature.accent === 'emerald' ? 'bg-emerald-500' :
                  feature.accent === 'blue' ? 'bg-blue-500' :
                  feature.accent === 'violet' ? 'bg-violet-500' :
                  feature.accent === 'amber' ? 'bg-amber-500' :
                  feature.accent === 'rose' ? 'bg-rose-500' :
                  'bg-cyan-500'
                }`} />
                
                <h3 className={`font-semibold text-slate-900 dark:text-white mb-2 ${
                  index === 0 ? 'text-xl lg:text-2xl' : 'text-lg'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-slate-600 dark:text-slate-400 leading-relaxed ${
                  index === 0 ? 'text-base lg:text-lg' : 'text-sm'
                }`}>
                  {feature.description}
                </p>

                {/* Hover arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRightIcon />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - Clean, minimal */}
      <section className="py-24 lg:py-32 bg-slate-100 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4 block">
              Como funciona
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
              Comece em 3 passos simples
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {[
              { 
                step: '01', 
                title: 'Crie sua conta', 
                desc: 'Cadastro gratuito em menos de 2 minutos. Sem cartão de crédito.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )
              },
              { 
                step: '02', 
                title: 'Configure', 
                desc: 'Adicione seus serviços, preços e personalize o sistema.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              },
              { 
                step: '03', 
                title: 'Comece a usar', 
                desc: 'Registre pedidos e acompanhe tudo em tempo real.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                    {item.icon}
                  </div>
                  <span className="inline-block text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                {i < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 text-slate-300 dark:text-slate-700">
                    <ArrowRightIcon />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Video or additional visual */}
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=675&fit=crop&q=80" 
                alt="Lavatec em ação - Interface do sistema"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 hover:bg-slate-900/30 transition-colors">
                <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                  <PlayIcon />
                </button>
              </div>
            </div>
            <p className="text-center text-sm text-slate-500 dark:text-slate-500 mt-4">
              Veja como é fácil gerenciar sua lavanderia com o Lavatec
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials - Editorial cards */}
      <section id="clientes" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4 block">
              Depoimentos
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              O que nossos clientes dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="relative bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300"
              >
                <QuoteIcon />
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-8 mt-4">
                  "{item.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{item.name}</p>
                    <p className="text-slate-500 dark:text-slate-500 text-xs">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Clean, user-friendly */}
      <section id="preços" className="py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4 block">
              Preços
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
              Planos simples e transparentes
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              14 dias grátis em todos os planos. Cancele quando quiser.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {[
              { name: 'Starter', price: '149', desc: 'Para lavanderias pequenas', features: ['Até 500 pedidos/mês', '1 unidade', '2 usuários', 'Relatórios básicos', 'Suporte por email'], popular: false },
              { name: 'Pro', price: '299', desc: 'Para crescer com você', features: ['Pedidos ilimitados', 'Até 3 unidades', '10 usuários', 'WhatsApp integrado', 'CRM completo', 'Suporte prioritário'], popular: true },
              { name: 'Enterprise', price: '599', desc: 'Para redes e franquias', features: ['Tudo do Pro', 'Unidades ilimitadas', 'API personalizada', 'Suporte dedicado', 'SLA garantido'], popular: false },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-emerald-600 dark:bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 scale-[1.02] md:scale-105 z-10' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-full shadow-lg">
                    ⭐ Mais Popular
                  </span>
                )}
                <h3 className={`text-xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.popular ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {plan.desc}
                </p>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    R${plan.price}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li 
                      key={j} 
                      className={`flex items-center gap-3 text-sm ${
                        plan.popular 
                          ? 'text-emerald-50' 
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.popular 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        <CheckIcon />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
                  }`}
                >
                  Começar agora
                </Link>
                {!plan.popular && (
                  <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">
                    Sem compromisso
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-16 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Confiado por mais de 500 lavanderias em todo o Brasil
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Dados seguros</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Cancele quando quiser</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="text-sm">Suporte em português</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Simple, impactful */}
      <section className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative bg-emerald-600 rounded-3xl p-12 lg:p-16 overflow-hidden">
            {/* Background image with overlay */}
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1521791055366-0d553872125f?w=1600&h=600&fit=crop&q=80" 
                alt="Equipe de lavanderia profissional"
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-emerald-600/90" />
            </div>
            
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            <div className="relative text-center max-w-2xl mx-auto z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Pronto para simplificar sua operação?
              </h2>
              <p className="text-emerald-100 text-lg mb-8">
                Junte-se a centenas de lavanderias que já transformaram seus negócios.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  Começar gratuitamente
                  <ArrowRightIcon />
                </Link>
                <a
                  href="#contato"
                  className="inline-flex items-center gap-2 px-8 py-4 text-white font-medium hover:text-emerald-100 transition-colors"
                >
                  Falar com vendas
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Clean, organized */}
      <footer className="py-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-lg font-semibold text-slate-900 dark:text-white">Lavatec</span>
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed">
                O software completo para gestão de lavanderias.
              </p>
            </div>
            
            {[
              { title: 'Produto', links: ['Recursos', 'Preços', 'Integrações', 'API'] },
              { title: 'Empresa', links: ['Sobre', 'Blog', 'Carreiras', 'Contato'] },
              { title: 'Legal', links: ['Termos', 'Privacidade', 'Cookies'] },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © {new Date().getFullYear()} Lavatec. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              {['M', 'X', 'In'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white transition-colors text-xs font-bold"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
