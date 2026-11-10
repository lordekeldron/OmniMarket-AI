import React, { useMemo, useState } from 'react';
import { BrandProfile } from '../types';

const REGIONS = ['Brasil', 'EUA', 'Europa', 'Ásia', 'LatAm', 'Oriente Médio'];
const TOPICS = [
  'Vídeo curto',
  'Quiet luxury',
  'IA no atendimento',
  'Sustentabilidade',
  'Social commerce',
  'Live shopping',
];

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 33 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

function heatFor(brandKey: string, region: string, topic: string) {
  const n = hashSeed(`${brandKey}|${region}|${topic}`);
  const bias =
    (region === 'Brasil' && (topic === 'Vídeo curto' || topic === 'Social commerce') ? 18 : 0) +
    (region === 'Europa' && topic === 'Sustentabilidade' ? 16 : 0) +
    (region === 'Ásia' && topic === 'Live shopping' ? 20 : 0) +
    (region === 'EUA' && topic === 'Quiet luxury' ? 12 : 0);
  return 28 + (n % 58) + bias;
}

interface GlobalTrendHeatmapProps {
  brand: BrandProfile;
  onFocusTopic: (topic: string) => void;
}

export const GlobalTrendHeatmap: React.FC<GlobalTrendHeatmapProps> = ({ brand, onFocusTopic }) => {
  const [active, setActive] = useState<{ region: string; topic: string; score: number } | null>(null);

  const cells = useMemo(() => {
    return REGIONS.flatMap((region) =>
      TOPICS.map((topic) => ({
        region,
        topic,
        score: Math.min(100, heatFor(`${brand.id}:${brand.industry}`, region, topic)),
      })),
    );
  }, [brand.id, brand.industry]);

  const hottest = cells.reduce((best, cell) => (cell.score > best.score ? cell : best), cells[0]);
  const selected = active ?? hottest;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#f7f3ee]">Mapa de calor global</h2>
          <p className="text-[13px] text-[#8a8174]">
            Intensidade de busca e conversa para {brand.name}. Clique numa célula para filtrar os temas.
          </p>
        </div>
        <p className="text-[13px] text-[#cfc6ba]">
          Pico: {hottest.topic} em {hottest.region} · {hottest.score}
        </p>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid min-w-[640px] gap-1"
          style={{ gridTemplateColumns: `120px repeat(${TOPICS.length}, minmax(0, 1fr))` }}
        >
          <div />
          {TOPICS.map((topic) => (
            <div key={topic} className="px-1 pb-1 text-[11px] text-[#b7aea2] leading-tight">
              {topic}
            </div>
          ))}
          {REGIONS.map((region) => (
            <React.Fragment key={region}>
              <div className="flex items-center text-[12px] text-[#efe7dc]">{region}</div>
              {TOPICS.map((topic) => {
                const cell = cells.find((c) => c.region === region && c.topic === topic)!;
                const isOn = selected.region === region && selected.topic === topic;
                return (
                  <button
                    key={`${region}-${topic}`}
                    type="button"
                    onClick={() => {
                      setActive(cell);
                      onFocusTopic(topic);
                    }}
                    title={`${region} · ${topic}: ${cell.score}`}
                    className={`h-9 rounded-sm transition-transform ${isOn ? 'ring-1 ring-[#f7f3ee] scale-[1.03]' : ''}`}
                    style={{ backgroundColor: `rgba(197, 106, 56, ${0.12 + cell.score / 115})` }}
                  >
                    <span className="sr-only">
                      {region} {topic} {cell.score}
                    </span>
                    <span className="text-[11px] tabular-nums text-[#1a120c]/80">{cell.score}</span>
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-[#8a8174]">
        <span>Baixa</span>
        <span className="h-2 w-28 rounded-sm" style={{ background: 'linear-gradient(90deg, rgba(197,106,56,0.15), rgba(197,106,56,0.95))' }} />
        <span>Alta</span>
        <span className="ml-auto text-[#cfc6ba]">
          {selected.region}: {selected.topic} está em {selected.score}/100
        </span>
      </div>
    </section>
  );
};
