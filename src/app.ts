// SPDX-License-Identifier: AGPL-3.0-or-later

import express from "express";
import { fileURLToPath } from "node:url";

import { agentReadiness, boardBrief, payload, riskBenchmarks, summary, verification } from "./services/aiGovernanceAgentReadinessScorecardService.js";
import {
  renderAgentReadiness,
  renderBoardBrief,
  renderDocs,
  renderOverview,
  renderRiskBenchmarks,
  renderVerification
} from "./services/render.js";

const app = express();
const port = Number(process.env.PORT ?? 5522);
const host = process.env.HOST || "0.0.0.0";

app.get("/", (_req, res) => res.type("html").send(renderOverview()));
app.get("/agent-readiness", (_req, res) => res.type("html").send(renderAgentReadiness()));
app.get("/risk-benchmarks", (_req, res) => res.type("html").send(renderRiskBenchmarks()));
app.get("/board-brief", (_req, res) => res.type("html").send(renderBoardBrief()));
app.get("/verification", (_req, res) => res.type("html").send(renderVerification()));
app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
app.get("/api/agent-readiness", (_req, res) => res.json(agentReadiness()));
app.get("/api/risk-benchmarks", (_req, res) => res.json(riskBenchmarks()));
app.get("/api/board-brief", (_req, res) => res.json(boardBrief()));
app.get("/api/verification", (_req, res) => res.json(verification()));
app.get("/api/sample", (_req, res) => res.json(payload()));

const currentFile = fileURLToPath(import.meta.url);
const invokedDirectly = process.argv[1] !== undefined && currentFile === process.argv[1];

if (invokedDirectly) {
  app.listen(port, host, () => {
    console.log(`AI Governance & Agent Readiness Scorecard listening on http://${host}:${port}`);
  });
}

export default app;
