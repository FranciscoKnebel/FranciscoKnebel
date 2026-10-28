#!/usr/bin/env python3
"""Sync Scholar data only after a complete, valid fetch.

Manual display overrides belong in src/data/publications-meta.json.
A missing/renamed existing title requires manual reconciliation; never silently
replace the portfolio with a partial Scholar response. SCRAPER_API_KEY is optional.
"""

from datetime import datetime, timezone
import json
import os
from pathlib import Path
import re
import sys
import tempfile
import time
import traceback

AUTHOR_ID = "_RHtqxIAAAAJ"
OUTPUT_PATH = Path(__file__).parent.parent / "src" / "data" / "publications.json"


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def infer_type(bib: dict, existing_type: str | None) -> str:
    if existing_type:
        return existing_type
    venue = (bib.get("venue") or bib.get("journal") or bib.get("booktitle") or "").lower()
    combined = venue + " " + bib.get("title", "").lower()
    if any(k in combined for k in ["thesis", "dissertação", "tcc", "trabalho de conclusão"]):
        return "M.Sc. Thesis" if any(k in combined for k in ["master", "m.sc", "mestrado"]) else "B.Sc. Thesis"
    if any(k in venue for k in ["conference", "proceedings", "symposium", "workshop", "congress"]):
        return "Conference"
    return "Journal Article"


def validate(publications: list[dict]) -> dict[str, dict]:
    if not isinstance(publications, list) or not publications:
        raise ValueError("No publications returned; preserving existing data")
    indexed = {}
    for pub in publications:
        title = pub.get("title")
        if not isinstance(title, str) or not title.strip():
            raise ValueError("Publication has no title")
        key = normalize(title)
        if key in indexed:
            raise ValueError(f"Duplicate publication: {title}")
        if type(pub.get("year")) is not int or not 1900 <= pub["year"] <= datetime.now(timezone.utc).year + 1:
            raise ValueError(f"Invalid publication year: {title}")
        if not isinstance(pub.get("authors"), list) or not pub["authors"] or any(not isinstance(a, str) or not a.strip() for a in pub["authors"]):
            raise ValueError(f"Missing publication authors: {title}")
        if type(pub.get("citations")) is not int or pub["citations"] < 0:
            raise ValueError(f"Invalid citation count: {title}")
        indexed[key] = pub
    return indexed


def sync_publications(client, output_path: Path = OUTPUT_PATH, pause=time.sleep) -> None:
    existing = validate(json.loads(output_path.read_text(encoding="utf-8"))) if output_path.exists() else {}
    author = client.search_author_id(AUTHOR_ID)
    author = client.fill(author, sections=["basics", "publications"])
    raw_pubs = author.get("publications", [])
    if not raw_pubs:
        raise ValueError("Empty author response; preserving existing data")

    synced_at = datetime.now(timezone.utc).isoformat()
    publications = []
    for pub in raw_pubs:
        pause(1.5)
        # Any individual fetch failure aborts the transaction, including timestamps.
        pub = client.fill(pub)
        bib = pub.get("bib", {})
        title = bib.get("title", "").strip()
        prev = existing.get(normalize(title), {})
        authors = [a.strip() for a in re.split(r"\s+and\s+", bib.get("author", "")) if a.strip()]
        year_raw = bib.get("pub_year")
        year = int(year_raw) if year_raw and str(year_raw).isdigit() else prev.get("year")
        venue = (bib.get("venue") or bib.get("journal") or bib.get("booktitle") or bib.get("citation") or prev.get("venue") or "").strip()
        entry = {
            **prev,
            "title": title,
            "type": infer_type(bib, prev.get("type")),
            "venue": venue,
            "year": year,
            "authors": authors or prev.get("authors", []),
            "citations": pub.get("num_citations"),
            "url": prev.get("url") or pub.get("pub_url"),
            "last_sync": synced_at,
        }
        publications.append({k: v for k, v in entry.items() if v is not None})

    indexed = validate(publications)
    missing = existing.keys() - indexed.keys()
    if missing:
        raise ValueError(f"Incomplete response or renamed titles ({len(missing)} missing); reconcile manually before retrying")
    publications.sort(key=lambda p: (-p["year"], p["title"]))
    # Write beside the destination so replacement is atomic on the same filesystem.
    temporary_path = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=output_path.parent, delete=False) as temporary:
            temporary_path = Path(temporary.name)
            temporary.write(json.dumps(publications, indent=2, ensure_ascii=False) + "\n")
        temporary_path.replace(output_path)
    finally:
        if temporary_path is not None:
            temporary_path.unlink(missing_ok=True)
    print(f"Synced {len(publications)} publications at {synced_at}")


def main() -> int:
    try:
        from scholarly import scholarly, ProxyGenerator
    except ImportError:
        print("ERROR: scholarly import failed; original traceback follows", file=sys.stderr)
        traceback.print_exc()
        return 1

    if api_key := os.environ.get("SCRAPER_API_KEY"):
        proxy = ProxyGenerator()
        if not proxy.ScraperAPI(api_key):
            raise RuntimeError("Could not configure Scholar proxy")
        scholarly.use_proxy(proxy)
    sync_publications(scholarly)
    return 0


if __name__ == "__main__":
    sys.exit(main())
