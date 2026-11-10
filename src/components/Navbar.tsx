import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  BarChart3,
  Users,
  Share2,
  MessageSquare,
  FileText,
  Presentation,
  Plus,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Printer,
  Target
} from 'lucide-react';
import { BrandProfile } from '../types';

interface NavbarProps {
  brands: BrandProfile[];
  activeBrand: BrandProfile;
  onSelectBrand: (brand: BrandProfile) => void;
  onOpenNewBrandModal: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSlideDeck: () => void;
  onTriggerPrint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brands,
  activeBrand,
  onSelectBrand,
  onOpenNewBrandModal,
  activeTab,
  onSelectTab,
  onOpenSlideDeck,
  onTriggerPrint,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'trends', label: 'Tendências de Consumo', icon: TrendingUp },
    { id: 'campaigns', label: 'Campanhas & Design Studio', icon: Sparkles },
    { id: 'audience', label: 'Inteligência de Audiência', icon: Target },
    { id: 'roi', label: 'Otimizador de ROI', icon: ArrowUpRight },
    { id: 'competitors', label: 'Monitor de Concorrentes', icon: Users },
    { id: 'social', label: 'Automação Social', icon: Share2 },
    { id: 'support', label: 'Chat com Clientes IA', icon: MessageSquare },
    { id: 'report', label: 'Relatório Executivo', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white print:hidden">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Switcher */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 text-lg">
                OM
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-tight text-white">OmniMarket AI</span>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-800/60">
                    Especialista
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">Inteligência de Marketing & Otimização de ROI</p>
              </div>
            </div>

            {/* Brand Profile Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-sm font-medium transition-colors"
                aria-expanded={dropdownOpen}
                aria-label="Selecionar marca ativa"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: activeBrand.accentColor }}
                />
                <span className="max-w-[140px] truncate text-slate-100">{activeBrand.name}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Alternar Perfil de Marca
                    </div>
                    {brands.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          onSelectBrand(b);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-sm hover:bg-slate-700/60 transition-colors ${
                          b.id === activeBrand.id ? 'bg-indigo-950/50 text-indigo-300 font-medium' : 'text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: b.accentColor }}
                          />
                          <div>
                            <div className="text-slate-100">{b.name}</div>
                            <div className="text-xs text-slate-400">{b.industry}</div>
                          </div>
                        </div>
                        {b.id === activeBrand.id && (
                          <span className="text-xs text-indigo-400 font-semibold">Ativa</span>
                        )}
                      </button>
                    ))}
                    <div className="border-t border-slate-700/80 my-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenNewBrandModal();
                        }}
                        className="w-full text-left px-3 py-2 flex items-center gap-2 text-sm text-indigo-400 hover:bg-indigo-950/40 hover:text-indigo-300 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar Nova Marca</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action CTAs: Slides & Export */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenSlideDeck}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium transition-all shadow-md shadow-indigo-600/20"
              aria-label="Abrir apresentação em slides"
            >
              <Presentation className="w-4 h-4" />
              <span className="hidden sm:inline">Apresentação de Slides</span>
              <span className="sm:hidden">Slides</span>
            </button>

            <button
              type="button"
              onClick={onTriggerPrint}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-colors"
              aria-label="Exportar relatório em PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar PDF</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
