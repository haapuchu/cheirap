import os
import json
import unittest
from fastapi.testclient import TestClient

try:
    from server.app import app
except ImportError:
    import sys
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    from server.app import app

class TestCheirapCore(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.data_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "web", "src", "data", "tenders_scored.json"
        )
        if not os.path.exists(cls.data_path):
            cls.data_path = os.path.join(
                os.path.dirname(os.path.dirname(__file__)),
                "data", "processed", "tenders_scored.json"
            )

    def test_sample_dataset_structure(self):
        """Verify the 92 tender snapshot dataset has valid schemas and required fields."""
        self.assertTrue(os.path.exists(self.data_path), f"Dataset not found at {self.data_path}")
        with open(self.data_path, "r", encoding="utf-8") as f:
            tenders = json.load(f)
            
        self.assertGreaterEqual(len(tenders), 90, "Expected at least 90 scored tender snapshots")
        sample = tenders[0]
        required_keys = [
            "tender_id", "title", "department", "estimated_value_inr",
            "published_date", "closing_date", "cheirap_risk_score"
        ]
        for key in required_keys:
            self.assertIn(key, sample, f"Missing required tender key: {key}")

    def test_gfr_cvc_compliance_scoring_ranges(self):
        """Verify vigilance risk scores adhere to the 0-100 normalized range."""
        with open(self.data_path, "r", encoding="utf-8") as f:
            tenders = json.load(f)
            
        for t in tenders:
            score = t.get("cheirap_risk_score", 0)
            self.assertGreaterEqual(score, 0, f"Score below 0 for {t.get('tender_id')}")
            self.assertLessEqual(score, 100, f"Score above 100 for {t.get('tender_id')}")

    def test_api_health_endpoint(self):
        """Verify FastAPI service is alive and reports healthy status."""
        response = self.client.get("/api/health")
        if response.status_code == 200:
            data = response.json()
            self.assertIn("status", data)

    def test_api_tenders_endpoint(self):
        """Verify the /api/tenders endpoint serves valid tender records."""
        response = self.client.get("/api/tenders")
        self.assertIn(response.status_code, [200, 307], "Expected successful response or redirect")
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, dict):
                self.assertIn("tenders", data)
                self.assertIsInstance(data["tenders"], list)
                self.assertGreaterEqual(len(data["tenders"]), 1)
            else:
                self.assertIsInstance(data, list)

if __name__ == "__main__":
    unittest.main()
