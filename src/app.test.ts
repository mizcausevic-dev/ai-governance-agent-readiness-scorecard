import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "./app.js";

describe("ai-governance-agent-readiness-scorecard app", () => {
  it("serves html routes", async () => {
    const htmlRoutes = ["/", "/agent-readiness", "/risk-benchmarks", "/board-brief", "/verification", "/docs"];
    for (const route of htmlRoutes) {
      const response = await request(app).get(route);
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("text/html");
    }
  });

  it("serves api routes", async () => {
    const apiRoutes = [
      "/api/dashboard/summary",
      "/api/agent-readiness",
      "/api/risk-benchmarks",
      "/api/board-brief",
      "/api/verification",
      "/api/sample"
    ];
    for (const route of apiRoutes) {
      const response = await request(app).get(route);
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("application/json");
    }
  });
});
