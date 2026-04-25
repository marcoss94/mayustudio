'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { StyleGeneralForm } from './StyleGeneralForm';
import { StyleSetsTab } from './StyleSetsTab';
import { StyleExtrasTab } from './StyleExtrasTab';
import type { SerializedStyle } from './types';
import type { GalleryImageRow, StyleWithSets } from '@/app/(admin)/admin/galeria/GalleryGrid';

type TabKey = 'general' | 'sets' | 'extras';

export interface DetailTabsProps {
  style: SerializedStyle;
  galleryImages: GalleryImageRow[];
  styleSlugs: StyleWithSets[];
}

export function DetailTabs({ style, galleryImages, styleSlugs }: DetailTabsProps) {
  const router = useRouter();
  const params = useSearchParams();
  const hasSets = style.type === 'SETS_AND_TIERS';
  const currentRaw = params.get('tab') as TabKey | null;
  const current: TabKey =
    currentRaw === 'sets' && !hasSets ? 'general' : (currentRaw ?? 'general');

  function go(tab: TabKey) {
    const next = new URLSearchParams(params);
    next.set('tab', tab);
    router.push(`?${next.toString()}`, { scroll: false });
  }

  const tabs: { key: TabKey; label: string; show: boolean }[] = [
    { key: 'general', label: 'General', show: true },
    { key: 'sets', label: `Sets (${style.sets.length})`, show: hasSets },
    { key: 'extras', label: `Extras (${style.extras.length})`, show: true },
  ];

  return (
    <div>
      <nav
        aria-label="Secciones"
        className="flex gap-1 overflow-x-auto border-b border-outline-variant/30 mb-6"
      >
        {tabs
          .filter((t) => t.show)
          .map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => go(t.key)}
              aria-current={current === t.key ? 'page' : undefined}
              className={cn(
                'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px',
                current === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface',
              )}
            >
              {t.label}
            </button>
          ))}
      </nav>

      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 md:p-8">
        {current === 'general' && (
          <StyleGeneralForm
            style={style}
            galleryImages={galleryImages}
            styleSlugs={styleSlugs}
          />
        )}
        {current === 'sets' && hasSets && (
          <StyleSetsTab
            style={style}
            galleryImages={galleryImages}
            styleSlugs={styleSlugs}
          />
        )}
        {current === 'extras' && <StyleExtrasTab style={style} />}
      </div>
    </div>
  );
}
