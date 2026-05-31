import request from "supertest";

import app from "../src/app.js";

const routes = [
  "/",
  "/agent-readiness",
  "/risk-benchmarks",
  "/board-brief",
  "/verification",
  "/docs",
  "/api/dashboard/summary",
  "/api/agent-readiness",
  "/api/risk-benchmarks",
  "/api/board-brief",
  "/api/verification",
  "/api/sample"
];

for (const route of routes) {
  const response = await request(app).get(route);
  if (response.status !== 200) {
    throw new Error(`Smoke check failed for ${route}: ${response.status}`);
  }
}

console.log(`Smoke check passed for ${routes.length} routes.`);
