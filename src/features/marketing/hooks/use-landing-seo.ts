import { useEffect } from 'react';

import { buildJsonLdDocument, JSON_LD_GRAPH_ID, SEO, SITE_URL } from '../model/seo';

type MetaSnapshot = { attr: 'name' | 'property'; key: string; previous: string | null };

function readMeta(attr: 'name' | 'property', key: string): string | null {
  return document.head.querySelector(`meta[${attr}="${key}"]`)?.getAttribute('content') ?? null;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector);

  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }

  el.setAttribute('content', content);
}

function restoreMeta(snapshots: MetaSnapshot[]): void {
  for (const item of snapshots) {
    const el = document.head.querySelector(`meta[${item.attr}="${item.key}"]`);

    if (!el) {
      continue;
    }

    if (item.previous === null) {
      el.remove();
    } else {
      el.setAttribute('content', item.previous);
    }
  }
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector(`link[rel="${rel}"]`);

  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }

  el.setAttribute('href', href);
}

/** Title, meta social, robots, canonical e JSON-LD único enquanto a landing está montada. */
export function useLandingSeo(): void {
  useEffect(() => {
    const previousTitle = document.title;
    const previousCanonical =
      document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null;

    const metaKeys: Array<{ attr: 'name' | 'property'; key: string; value: string }> = [
      { attr: 'name', key: 'description', value: SEO.description },
      { attr: 'name', key: 'keywords', value: SEO.keywords },
      { attr: 'name', key: 'robots', value: 'index, follow, max-image-preview:large, max-snippet:-1' },
      { attr: 'name', key: 'googlebot', value: 'index, follow' },
      { attr: 'property', key: 'og:type', value: 'website' },
      { attr: 'property', key: 'og:locale', value: SEO.locale },
      { attr: 'property', key: 'og:site_name', value: SEO.siteName },
      { attr: 'property', key: 'og:url', value: `${SITE_URL}/` },
      { attr: 'property', key: 'og:title', value: SEO.title },
      { attr: 'property', key: 'og:description', value: SEO.description },
      { attr: 'name', key: 'twitter:card', value: 'summary' },
      { attr: 'name', key: 'twitter:title', value: SEO.title },
      { attr: 'name', key: 'twitter:description', value: SEO.description },
    ];

    const snapshots: MetaSnapshot[] = metaKeys.map(({ attr, key }) => ({
      attr,
      key,
      previous: readMeta(attr, key),
    }));

    document.title = SEO.title;
    for (const { attr, key, value } of metaKeys) {
      upsertMeta(attr, key, value);
    }
    upsertLink('canonical', `${SITE_URL}/`);

    const script = document.createElement('script');
    script.id = JSON_LD_GRAPH_ID;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(buildJsonLdDocument());
    document.getElementById(JSON_LD_GRAPH_ID)?.remove();
    document.head.appendChild(script);

    return () => {
      document.title = previousTitle;
      restoreMeta(snapshots);
      document.getElementById(JSON_LD_GRAPH_ID)?.remove();

      const canonical = document.head.querySelector('link[rel="canonical"]');
      if (canonical) {
        if (previousCanonical === null) {
          canonical.remove();
        } else {
          canonical.setAttribute('href', previousCanonical);
        }
      }
    };
  }, []);
}
