"""Offline regression tests: failures must preserve the last successful snapshot."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("scholar_sync", Path(__file__).with_name("scrape-scholar.py"))
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class Client:
    def __init__(self, pubs, fail=False):
        self.pubs = pubs
        self.fail = fail

    def search_author_id(self, author_id):
        return {}

    def fill(self, item, sections=None):
        if sections:
            return {"publications": self.pubs}
        if self.fail:
            raise RuntimeError("Simulated partial fetch failure")
        return item


class SyncTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.output = Path(self.temp.name) / "publications.json"
        self.existing = [{"title": "Existing paper", "year": 2024, "authors": ["Francisco Knebel"], "citations": 12, "url": "https://example.org/paper", "type": "Conference", "last_sync": "2026-07-18T10:00:00"}]
        self.output.write_text(json.dumps(self.existing))
        self.before = self.output.read_bytes()
        self.pub = {"bib": {"title": "Existing paper", "pub_year": "2024", "author": "Francisco Knebel"}, "num_citations": 15}

    def run_sync(self, client):
        sync.sync_publications(client, self.output, pause=lambda _: None)

    def test_success_preserves_manual_fields_and_dates_all_records(self):
        self.run_sync(Client([self.pub]))
        result = json.loads(self.output.read_text())[0]
        self.assertEqual(result["citations"], 15)
        self.assertEqual(result["type"], "Conference")
        self.assertEqual(result["url"], "https://example.org/paper")
        self.assertTrue(result["last_sync"].endswith("+00:00"))

    def test_empty_missing_duplicate_invalid_and_failed_fetch_preserve_bytes(self):
        for client in [Client([]), Client([{"bib": {"title": "Different paper", "pub_year": "2024", "author": "A"}, "num_citations": 1}]), Client([self.pub, self.pub]), Client([{"bib": {"title": "Existing paper"}, "num_citations": -1}]), Client([self.pub], fail=True)]:
            with self.subTest(client=client), self.assertRaises((ValueError, RuntimeError)):
                self.run_sync(client)
            self.assertEqual(self.output.read_bytes(), self.before)

    def test_incomplete_new_publication_cannot_replace_existing_snapshot(self):
        with self.assertRaises(ValueError):
            self.run_sync(Client([self.pub, {"bib": {"title": "Incomplete new paper"}}]))
        self.assertEqual(self.output.read_bytes(), self.before)

    def test_failed_atomic_replace_preserves_snapshot_and_cleans_tempfile(self):
        with patch.object(Path, "replace", side_effect=OSError("disk error")):
            with self.assertRaises(OSError):
                self.run_sync(Client([self.pub]))
        self.assertEqual(self.output.read_bytes(), self.before)
        self.assertEqual(list(self.output.parent.iterdir()), [self.output])


if __name__ == "__main__":
    unittest.main()
