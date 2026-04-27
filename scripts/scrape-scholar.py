#!/usr/bin/env python3
"""
Scrapes Francisco Knebel's Google Scholar profile and updates
src/data/publications.json.

Preserves manually set fields: venueUrl, advisor, type.
New publications inherit `type` inferred from venue/title.

Usage:
    python scripts/scrape-scholar.py

Proxy (if CAPTCHA blocks the run):
    Set SCRAPER_API_KEY env var to use ScraperAPI (free tier available at
    https://www.scraperapi.com). If unset, runs without proxy.
"""

from datetime import datetime
import json
import os
import re
import sys
import time
from pathlib import Path

try:
    from scholarly import scholarly, ProxyGenerator
except ImportError:
    print("ERROR: scholarly not installed — run: pip install scholarly", file=sys.stderr)
    sys.exit(1)

# ── Config ────────────────────────────────────────────────────────────────────

AUTHOR_ID   = "_RHtqxIAAAAJ"
OUTPUT_PATH = Path(__file__).parent.parent / "src" / "data" / "publications.json"

# Manual overrides live in publications-meta.json — scraper writes raw data only.

# ── Helpers ───────────────────────────────────────────────────────────────────

def normalize(text: str) -> str:
    """Lowercase + collapse whitespace for fuzzy title matching."""
    return re.sub(r"\s+", " ", text.strip().lower())


def infer_type(bib: dict, existing_type: str | None) -> str:
    """Infer publication type from bib fields; prefers existing value."""
    if existing_type:
        return existing_type

    venue = (
        bib.get("venue") or bib.get("journal") or bib.get("booktitle") or ""
    ).lower()
    title = bib.get("title", "").lower()
    combined = venue + " " + title

    if any(k in combined for k in ["thesis", "dissertação", "tcc", "trabalho de conclusão"]):
        if any(k in combined for k in ["master", "m.sc", "mestrado"]):
            return "M.Sc. Thesis"
        return "B.Sc. Thesis"

    if any(k in venue for k in ["conference", "proceedings", "symposium", "workshop", "congress"]):
        return "Conference"

    return "Journal Article"


def parse_authors(author_str: str) -> list[str]:
    """
    scholarly returns names as "Last, First and Last, First" or plain
    "First Last and First Last". Return a clean list preserving the format.
    """
    if not author_str:
        return []
    parts = re.split(r"\s+and\s+", author_str.strip())
    return [p.strip() for p in parts if p.strip()]


def setup_proxy() -> bool:
    """Configure ScraperAPI proxy if SCRAPER_API_KEY is set."""
    api_key = os.environ.get("SCRAPER_API_KEY")
    if not api_key:
        return False
    try:
        pg = ProxyGenerator()
        pg.ScraperAPI(api_key)
        scholarly.use_proxy(pg)
        print("Proxy: ScraperAPI configured")
        return True
    except Exception as exc:
        print(f"Warning: could not configure proxy — {exc}", file=sys.stderr)
        return False


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    setup_proxy()

    # ── Load existing JSON to preserve manual fields ──────────────────────────
    existing: dict[str, dict] = {}
    if OUTPUT_PATH.exists():
        try:
            data = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
            existing = {normalize(p["title"]): p for p in data if "title" in p}
            print(f"Existing publications loaded: {len(existing)}")
        except Exception as exc:
            print(f"Warning: could not parse existing JSON — {exc}", file=sys.stderr)

    # ── Fetch author ──────────────────────────────────────────────────────────
    print(f"Fetching author {AUTHOR_ID} …")
    try:
        author = scholarly.search_author_id(AUTHOR_ID)
        author = scholarly.fill(author, sections=["basics", "publications"])
    except Exception as exc:
        print(f"ERROR: failed to fetch author — {exc}", file=sys.stderr)
        sys.exit(1)

    basics = {
        "citations": author.get("citedby", 0),
        "hindex":    author.get("hindex", 0),
        "i10index":  author.get("i10index", 0),
    }
    print(f"Author: {author.get('name')} | citations={basics['citations']} h={basics['hindex']}")

    # ── Fetch each publication ─────────────────────────────────────────────────
    raw_pubs: list = author.get("publications", [])
    print(f"Publications to fetch: {len(raw_pubs)}")

    publications = []

    for idx, pub in enumerate(raw_pubs, 1):
        try:
            time.sleep(1.5)   # polite delay between requests
            pub = scholarly.fill(pub)
        except Exception as exc:
            print(f"  [{idx}/{len(raw_pubs)}] Warning: fill failed — {exc}", file=sys.stderr)

        bib   = pub.get("bib", {})
        title = bib.get("title", "").strip()
        if not title:
            continue

        norm = normalize(title)
        prev = existing.get(norm, {})

        venue    = (bib.get("venue") or bib.get("journal") or bib.get("booktitle") or bib.get("citation") or "").strip()
        year_raw = bib.get("pub_year")
        year     = int(year_raw) if year_raw and str(year_raw).isdigit() else prev.get("year")
        authors  = parse_authors(bib.get("author", "")) or prev.get("authors", [])

        entry: dict = {
            "title":     title,
            "type":      infer_type(bib, prev.get("type")),
            "venue":     venue or prev.get("venue", ""),
            "year":      year,
            "authors":   authors,
            "citations": pub.get("num_citations", 0),
            # Prefer existing external URL (arxiv/researchgate) over Scholar URL
            "url":       prev.get("url") or pub.get("pub_url") or None,
            "last_sync": datetime.now().isoformat(),
        }

        # Drop null values for clean JSON
        entry = {k: v for k, v in entry.items() if v is not None}

        publications.append(entry)
        print(f"  [{idx}/{len(raw_pubs)}] {title[:70]}")

    # ── Safety check ──────────────────────────────────────────────────────────
    if not publications:
        print("ERROR: no publications returned — aborting to preserve existing data", file=sys.stderr)
        sys.exit(1)

    # ── Sort newest first ─────────────────────────────────────────────────────
    publications.sort(key=lambda p: p.get("year") or 0, reverse=True)

    # ── Write output ──────────────────────────────────────────────────────────
    OUTPUT_PATH.write_text(
        json.dumps(publications, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"\nDone — wrote {len(publications)} publications to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
