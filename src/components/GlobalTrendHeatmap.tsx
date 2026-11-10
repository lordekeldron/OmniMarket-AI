import React, { useEffect, useMemo, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { BrandProfile } from '../types';

const TOPICS = [
  'Vídeo curto',
  'Quiet luxury',
  'IA no atendimento',
  'Sustentabilidade',
  'Social commerce',
  'Live shopping',
];

const GEO_URL =
  'https://unpkg.com/three-globe@2.31.1/example/country-polygons/ne_110m_admin_0_countries.geojson';
const EARTH_URL = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';

type CountryProps = {
  NAME?: string;
  ISO_A2?: string;
  CONTINENT?: string;
  SUBREGION?: string;
};

type CountryFeature = {
  properties: CountryProps;
};

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 33 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

function marketOf(props: CountryProps) {
  const iso = props.ISO_A2 || '';
  const sub = props.SUBREGION || '';
  const continent = props.CONTINENT || '';
  if (iso === 'BR') return 'Brasil';
  if (iso === 'US') return 'EUA';
  if (continent === 'Europe') return 'Europa';
  if (sub === 'Western Asia') return 'Oriente Médio';
  if (continent === 'South America' || sub.includes('Central America') || sub === 'Caribbean') return 'LatAm';
  if (continent === 'Asia') return 'Ásia';
  if (continent === 'Africa') return 'África';
  if (continent === 'Oceania' || continent === 'North America') return 'Oceania e Canadá';
  return 'Outros';
}

function heatFor(brandKey: string, market: string, topic: string) {
  const n = hashSeed(`${brandKey}|${market}|${topic}`);
  const bias =
    (market === 'Brasil' && (topic === 'Vídeo curto' || topic === 'Social commerce') ? 18 : 0) +
    (market === 'Europa' && topic === 'Sustentabilidade' ? 16 : 0) +
    (market === 'Ásia' && topic === 'Live shopping' ? 20 : 0) +
    (market === 'EUA' && topic === 'Quiet luxury' ? 12 : 0) +
    (market === 'LatAm' && topic === 'Vídeo curto' ? 10 : 0) +
    (market === 'Oriente Médio' && topic === 'Quiet luxury' ? 8 : 0);
  return Math.min(100, 28 + (n % 52) + bias);
}

function countryName(props: CountryProps) {
  const iso = props.ISO_A2;
  if (iso && iso !== '-99') {
    try {
      const label = new Intl.DisplayNames(['pt-BR'], { type: 'region' }).of(iso);
      if (label) return label;
    } catch {
      /* keep the source name */
    }
  }
  return props.NAME || 'País';
}

interface GlobalTrendHeatmapProps {
  brand: BrandProfile;
  onFocusTopic: (topic: string) => void;
}

export const GlobalTrendHeatmap: React.FC<GlobalTrendHeatmapProps> = ({ brand, onFocusTopic }) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<any>(null);
  const [width, setWidth] = useState(720);
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [hover, setHover] = useState<CountryFeature | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(GEO_URL)
      .then((res) => {
        if (!res.ok) throw new Error('geo');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setCountries(data.features || []);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const controls = globeRef.current?.controls?.();
    if (!controls) return;
    controls.autoRotate = !hover;
    controls.autoRotateSpeed = 0.45;
  }, [hover, countries.length]);

  const brandKey = `${brand.id}:${brand.industry}`;

  const scoresFor = (props: CountryProps) => {
    const market = marketOf(props);
    return TOPICS.map((topic) => ({
      topic,
      score: heatFor(brandKey, market, topic),
    })).sort((a, b) => b.score - a.score);
  };

  const capColor = useMemo(() => {
    return (feature: object) => {
      const props = (feature as CountryFeature).properties || {};
      const top = heatFor(brandKey, marketOf(props), 'Vídeo curto');
      const alpha = 0.18 + top / 140;
      return `rgba(197, 106, 56, ${alpha.toFixed(3)})`;
    };
  }, [brandKey]);

  const hoveredProps = hover?.properties;
  const hoveredScores = hoveredProps ? scoresFor(hoveredProps) : [];
  const hoveredMarket = hoveredProps ? marketOf(hoveredProps) : '';

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-[#f7f3ee]">Globo de tendências</h2>
        <p className="text-[13px] text-[#8a8174]">
          Passe o mouse sobre um país para ver as tendências de {brand.name} naquele mercado.
        </p>
      </div>

      <div ref={wrapRef} className="relative h-[520px] overflow-hidden rounded-md border border-white/10 bg-[#0c0b0a]">
        {!loadError && (
          <Globe
            ref={globeRef}
            width={width}
            height={520}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl={EARTH_URL}
            atmosphereColor="#c56a38"
            atmosphereAltitude={0.16}
            polygonsData={countries}
            polygonAltitude={0.012}
            polygonCapColor={capColor}
            polygonSideColor={() => 'rgba(26, 18, 12, 0.45)'}
            polygonStrokeColor={() => 'rgba(247, 243, 238, 0.35)'}
            polygonsTransitionDuration={0}
            onPolygonHover={(feature: unknown) => setHover((feature as CountryFeature) || null)}
            onPolygonClick={(feature: unknown) => {
              const props = (feature as CountryFeature | null)?.properties;
              if (!props) return;
              const top = scoresFor(props)[0];
              if (top) onFocusTopic(top.topic);
            }}
            polygonLabel={() => ''}
          />
        )}

        {loadError && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-[#b7aea2]">
            Não foi possível carregar o mapa de países.
          </p>
        )}

        {hoveredProps && (
          <aside className="pointer-events-none absolute right-3 top-3 w-[min(100%-1.5rem,280px)] rounded-md border border-white/10 bg-[#161411]/92 p-3 backdrop-blur-sm">
            <p className="text-[11px] text-[#b7aea2]">{hoveredMarket}</p>
            <h3 className="text-[15px] font-semibold text-[#f7f3ee]">{countryName(hoveredProps)}</h3>
            <ul className="mt-2 space-y-1.5">
              {hoveredScores.slice(0, 4).map((item) => (
                <li key={item.topic} className="flex items-center justify-between gap-3 text-[12px]">
                  <span className="text-[#efe7dc]">{item.topic}</span>
                  <span className="tabular-nums text-[#e0a06a]">{item.score}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-[#8a8174]">Clique no país para filtrar a lista pelo tema mais forte.</p>
          </aside>
        )}
      </div>
    </section>
  );
};
