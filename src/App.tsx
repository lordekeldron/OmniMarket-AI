import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { TrendsView } from './components/TrendsView';
import { CampaignStudio } from './components/CampaignStudio';
import { AudienceIntelligence } from './components/AudienceIntelligence';
import { RoiEngine } from './components/RoiEngine';
import { CompetitorMonitor } from './components/CompetitorMonitor';
import { SocialAutomation } from './components/SocialAutomation';
import { SupportChat } from './components/SupportChat';
import { ReportView } from './components/ReportView';
import { BrandProfileModal } from './components/BrandProfileModal';
import { SlideDeckModal } from './components/SlideDeckModal';

import {
  initialBrands,
  sampleTrends,
  sampleChannels,
  sampleCompetitors,
  sampleScheduledPosts,
  defaultCampaignData,
} from './data/mockData';
import { BrandProfile, TrendData, ChannelPerformanceData, CompetitorData, ScheduledPost, CampaignCreative, MacroTrend, LookalikeSegment } from './types';
import { optimizeChannelAllocations } from './utils/marketingMath';

export default function App() {
  // Brand Profiles State
  const [brands, setBrands] = useState<BrandProfile[]>(initialBrands);
  const [activeBrand, setActiveBrand] = useState<BrandProfile>(initialBrands[0]);

  // Tab State
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Core Marketing Data State
  const [trends, setTrends] = useState<TrendData>(sampleTrends[activeBrand.id] || sampleTrends.lumina);
  const [channels, setChannels] = useState<ChannelPerformanceData[]>(sampleChannels);
  const [competitors, setCompetitors] = useState<CompetitorData[]>(sampleCompetitors);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(sampleScheduledPosts);
  const [campaign, setCampaign] = useState<CampaignCreative>(defaultCampaignData);

  // Modal States
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isSlideDeckOpen, setIsSlideDeckOpen] = useState(false);
  const [optimizationApplied, setOptimizationApplied] = useState(false);
  const [prefillTrendTopic, setPrefillTrendTopic] = useState<string | undefined>(undefined);

  // Switch Brand Profile Handler
  const handleSelectBrand = (brand: BrandProfile) => {
    setActiveBrand(brand);
    if (sampleTrends[brand.id]) {
      setTrends(sampleTrends[brand.id]);
    } else {
      // Generate default trend summary for custom brand
      setTrends({
        summary: `Tendências e comportamento de consumo monitorados para ${brand.name} no setor de ${brand.industry}. O público ${brand.targetAudience} busca conveniência, personalização e autenticidade.`,
        macroTrends: [
          {
            name: 'Compras em Vídeos Curtos (UGC)',
            growthRate: '+64%',
            sentiment: 'Positivo',
            category: 'Social Commerce',
            description: 'Formatos autênticos com criadores de nicho convertem 3x mais que anúncios genéricos.',
            predictedImpact: 'Muito Alto',
            recommendedAction: `Veicular criativos autênticos focados em: "${brand.valueProposition}"`,
            relevantKeywords: ['#UGC', '#ReviewReal', '#Tendencia2026'],
          },
          {
            name: 'Atendimento Instantâneo com IA',
            growthRate: '+50%',
            sentiment: 'Altamente Positivo',
            category: 'Tecnológica',
            description: 'Redução do tempo de resposta para menos de 1 minuto aumenta taxa de conversão em 45%.',
            predictedImpact: 'Alto',
            recommendedAction: 'Manter o assistente de suporte 24/7 ativo nas redes.',
            relevantKeywords: ['#AtendimentoImediato', '#SuporteVIP'],
          },
        ],
        viralHooks: [
          `"O que você precisa saber antes de comprar qualquer produto de ${brand.industry}..."`,
          `"Por que a ${brand.name} virou a escolha número 1 de quem busca qualidade..."`,
        ],
        roiOpportunity: 'Migrar 30% do orçamento para canais sociais de vídeo para capturar o pico de conversões.',
      });
    }
  };

  // Save New Brand Profile
  const handleSaveBrand = (newBrand: BrandProfile) => {
    setBrands((prev) => [...prev, newBrand]);
    handleSelectBrand(newBrand);
  };

  // One-Click ROI Optimization from Dashboard or ROI Engine
  const handleApplyOptimization = () => {
    const optimization = optimizeChannelAllocations(channels);
    const updatedChannels: ChannelPerformanceData[] = channels.map((c) => {
      const rec = optimization.items.find((i) => i.channelId === c.id);
      return rec
        ? {
            ...c,
            spend: rec.recommendedSpend,
            revenue: rec.predictedRevenue,
            roas: rec.predictedROAS,
            cpa: Number((rec.recommendedSpend / (c.conversions || 1)).toFixed(2)),
          }
        : c;
    });

    setChannels(updatedChannels);
    setOptimizationApplied(true);
  };

  // Navigate to Campaign Studio prefilled from a Trend
  const handleSelectTrendForCampaign = (trend: MacroTrend) => {
    setPrefillTrendTopic(`${trend.name}: ${trend.recommendedAction}`);
    setActiveTab('campaigns');
  };

  // Navigate to Campaign Studio from Competitor Counter-Strategy
  const handleSelectCounterStrategy = (strategy: string) => {
    setPrefillTrendTopic(`Contra-Estratégia: ${strategy}`);
    setActiveTab('campaigns');
  };

  // Add Scheduled Post
  const handleAddPost = (post: ScheduledPost) => {
    setScheduledPosts((prev) => [post, ...prev]);
  };

  // Instant Publish Post
  const handlePublishPostNow = (id: string) => {
    setScheduledPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'published',
              scheduledTime: 'Publicado agora',
              impressions: Math.floor(Math.random() * 5000) + 1200,
              likes: Math.floor(Math.random() * 400) + 85,
              engagementRate: (Math.random() * 3 + 4).toFixed(1) + '%',
            }
          : p
      )
    );
  };

  // Add Competitor
  const handleAddCompetitor = (newComp: CompetitorData) => {
    setCompetitors((prev) => [newComp, ...prev]);
  };

  // Apply Audience Lookalike Segment to Campaign
  const handleApplyAudienceToCampaign = (segment: LookalikeSegment) => {
    setCampaign((prev) => ({
      ...prev,
      tagline: `${prev.tagline} · Lookalike: ${segment.name}`,
      channels: {
        ...prev.channels,
        instagram: {
          ...prev.channels.instagram,
          hook: segment.recommendedHook,
          cta: segment.recommendedCTA,
        },
      },
      designDirectives: {
        ...prev.designDirectives,
        adBannerCreative: {
          ...prev.designDirectives.adBannerCreative,
          mainHeadline: segment.recommendedHook,
          badgeText: segment.tier,
          ctaButtonText: segment.recommendedCTA,
        },
      },
      expectedMetrics: {
        estimatedCTR: segment.projectedMetrics.estimatedCTR,
        estimatedCPA: segment.projectedMetrics.estimatedCPA,
        projectedROAS: segment.projectedMetrics.projectedROAS,
      },
    }));
    setActiveTab('campaigns');
  };

  // Print Handler
  const handleTriggerPrint = () => {
    setActiveTab('report');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        brands={brands}
        activeBrand={activeBrand}
        onSelectBrand={handleSelectBrand}
        onOpenNewBrandModal={() => setIsBrandModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSlideDeck={() => setIsSlideDeckOpen(true)}
        onTriggerPrint={handleTriggerPrint}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <DashboardOverview
            brand={activeBrand}
            channels={channels}
            trends={trends}
            onNavigateTab={setActiveTab}
            onApplyOptimization={handleApplyOptimization}
            optimizationApplied={optimizationApplied}
          />
        )}

        {activeTab === 'trends' && (
          <TrendsView
            brand={activeBrand}
            trends={trends}
            onUpdateTrends={setTrends}
            onSelectTrendForCampaign={handleSelectTrendForCampaign}
          />
        )}

        {activeTab === 'campaigns' && (
          <CampaignStudio
            brand={activeBrand}
            campaign={campaign}
            onUpdateCampaign={setCampaign}
            prefillTrendTopic={prefillTrendTopic}
          />
        )}

        {activeTab === 'audience' && (
          <AudienceIntelligence
            brand={activeBrand}
            channels={channels}
            onApplyAudienceToCampaign={handleApplyAudienceToCampaign}
            campaign={campaign}
          />
        )}

        {activeTab === 'roi' && (
          <RoiEngine
            brand={activeBrand}
            channels={channels}
            onApplyNewAllocations={(newCh) => {
              setChannels(newCh);
              setOptimizationApplied(true);
            }}
          />
        )}

        {activeTab === 'competitors' && (
          <CompetitorMonitor
            brand={activeBrand}
            competitors={competitors}
            onAddCompetitor={handleAddCompetitor}
            onSelectCounterStrategy={handleSelectCounterStrategy}
          />
        )}

        {activeTab === 'social' && (
          <SocialAutomation
            brand={activeBrand}
            scheduledPosts={scheduledPosts}
            onAddPost={handleAddPost}
            onPublishPostNow={handlePublishPostNow}
          />
        )}

        {activeTab === 'support' && (
          <SupportChat brand={activeBrand} />
        )}

        {activeTab === 'report' && (
          <ReportView
            brand={activeBrand}
            channels={channels}
            trends={trends}
            competitors={competitors}
            campaign={campaign}
            onOpenSlideDeck={() => setIsSlideDeckOpen(true)}
            onTriggerPrint={handleTriggerPrint}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>OmniMarket AI Especialista · Otimização Preditiva de ROI & Marketing Autônomo</span>
          </div>
          <div>
            Monitorando {brands.length} perfis de marca simultaneamente em tempo real.
          </div>
        </div>
      </footer>

      {/* Brand Profile Modal */}
      <BrandProfileModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onSaveBrand={handleSaveBrand}
      />

      {/* Interactive Presentation Slide Deck Modal */}
      <SlideDeckModal
        isOpen={isSlideDeckOpen}
        onClose={() => setIsSlideDeckOpen(false)}
        brand={activeBrand}
        channels={channels}
        trends={trends}
        competitors={competitors}
        campaign={campaign}
        onTriggerPrint={handleTriggerPrint}
      />
    </div>
  );
}
