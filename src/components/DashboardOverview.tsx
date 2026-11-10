import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Zap,
  Target,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  ArrowRight,
  Eye,
  CheckCircle2,
  BarChart2,
  Flame
} from 'lucide-react';
import { BrandProfile, ChannelPerformanceData, TrendData } from '../types';

interface DashboardOverviewProps {
  brand: BrandProfile;
  channels: ChannelPerformanceData[];
  trends: TrendData;
  onNavigateTab: (tab: string) => void;
  onApplyOptimization: () => void;
  optimizationApplied: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  brand,
  channels,
  trends,
  onNavigateTab,
  onApplyOptimization,
  optimizationApplied,
}) => {
  const totalSpend = channels.reduce((sum, c) => sum + c.spend, 0);
  const totalRevenue = channels.reduce((sum, c) => sum + c.revenue, 0);
  const totalConversions = channels.reduce((sum, c) => sum + c.conversions, 0);
  const blendedROAS = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0';
  const avgCPA = totalConversions > 0 ? (totalSpend / totalConversions).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      {/* Brand Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: brand.accentColor }}
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Workspace Ativo
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400">{brand.industry}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {brand.name}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              {brand.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('campaigns')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:translate-y-[-1px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Criar Nova Campanha & Artes</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('trends')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-all"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Ver Radar de Tendências</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('audience')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-all"
            >
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Inteligência de Audiência</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Predictive Anomaly & Opportunity Banner */}
      <div className={`border rounded-2xl p-5 transition-all ${
        optimizationApplied
          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
          : 'bg-indigo-950/40 border-indigo-800/80 text-indigo-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-2 rounded-xl mt-0.5 sm:mt-0 ${
              optimizationApplied ? 'bg-emerald-800/50 text-emerald-300' : 'bg-indigo-800/50 text-indigo-300'
            }`}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  {optimizationApplied ? 'Otimização Preditiva Aplicada com Sucesso' : 'Oportunidade Preditiva de ROI Detectada em Tempo Real'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-sm mt-1 text-slate-200 font-medium">
                {optimizationApplied
                  ? 'Os orçamentos foram rebalanceados dinamicamente para os canais de maior ROAS marginal. Projeção de receita aumentada em +38.2%.'
                  : 'Algoritmo detectou: Formato Reels & TikTok está gerando ROAS de 5.2x com CPA 38% menor que Google Search. Rebalanceamento recomendado para capturar R$ 14.800 adicionais.'}
              </p>
            </div>
          </div>
          {!optimizationApplied && (
            <button
              type="button"
              onClick={onApplyOptimization}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md transition-all whitespace-nowrap"
            >
              <Zap className="w-4 h-4" />
              <span>Otimizar Orçamento (1-Clique)</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Receita Gerada</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            R$ {totalRevenue.toLocaleString('pt-BR')}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.6% vs. período anterior</span>
          </div>
        </div>

        {/* Ad Spend */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Investimento Tráfego</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            R$ {totalSpend.toLocaleString('pt-BR')}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {((totalSpend / (brand.monthlyBudget || 30000)) * 100).toFixed(0)}% do budget mensal
          </div>
        </div>

        {/* Blended ROAS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">ROAS Geral</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {blendedROAS}x
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Meta: 3.5x (Superada)</span>
          </div>
        </div>

        {/* CPA */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">CPA Médio</span>
            <BarChart2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            R$ {avgCPA}
          </div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
            <span>-18.4% de redução de custo</span>
          </div>
        </div>

        {/* Conversions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Conversões</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {totalConversions.toLocaleString('pt-BR')}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Taxa média: 3.42%
          </div>
        </div>
      </div>

      {/* Main Grid: Channels Breakdown & Live Consumer Trend Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Performance Matrix */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Eficiência por Canal de Mídia</h2>
              <p className="text-xs text-slate-400">Atribuição multitoque em tempo real</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('roi')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
            >
              <span>Simulador Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {channels.map((ch) => {
              const maxRevenue = Math.max(...channels.map((c) => c.revenue));
              const pct = (ch.revenue / maxRevenue) * 100;
              return (
                <div key={ch.id} className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-white">{ch.name}</span>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-slate-400">
                        Investimento: <strong className="text-slate-200">R$ {ch.spend.toLocaleString('pt-BR')}</strong>
                      </span>
                      <span className="text-slate-400">
                        Receita: <strong className="text-emerald-400">R$ {ch.revenue.toLocaleString('pt-BR')}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 font-bold border border-indigo-800/60">
                        {ch.roas}x ROAS
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{ch.clicks.toLocaleString()} cliques ({ch.ctr}% CTR)</span>
                    <span>{ch.conversions} vendas (CPA: R$ {ch.cpa})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consumer Trends Radar Highlight */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h2 className="text-base font-bold text-white">Radar de Consumo</h2>
              </div>
              <span className="text-xs text-amber-400 font-medium">Ao Vivo</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {trends.summary}
            </p>

            <div className="space-y-2.5">
              {trends.macroTrends.slice(0, 2).map((t, idx) => (
                <div key={idx} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-200">{t.name}</span>
                    <span className="font-mono font-bold text-emerald-400">{t.growthRate}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {t.recommendedAction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('trends')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <span>Explorar Tendências & Ganchos Virais</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
