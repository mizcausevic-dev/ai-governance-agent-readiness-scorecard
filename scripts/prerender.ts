import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { agentReadiness, boardBrief, payload, riskBenchmarks, summary, verification } from "../src/services/aiGovernanceAgentReadinessScorecardService.js";
import { renderAgentReadiness, renderBoardBrief, renderDocs, renderOverview, renderRiskBenchmarks, renderVerification } from "../src/services/render.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const site = path.join(root, "site");

const files: Record<string, string> = {
  "index.html": renderOverview(),
  [path.join("agent-readiness", "index.html")]: renderAgentReadiness(),
  [path.join("risk-benchmarks", "index.html")]: renderRiskBenchmarks(),
  [path.join("board-brief", "index.html")]: renderBoardBrief(),
  [path.join("verification", "index.html")]: renderVerification(),
  [path.join("docs", "index.html")]: renderDocs(),
  "robots.txt": "User-agent: *\nAllow: /\nSitemap: https://readiness.kineticgain.com/sitemap.xml\n",
  "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://readiness.kineticgain.com/</loc></url>
  <url><loc>https://readiness.kineticgain.com/agent-readiness/</loc></url>
  <url><loc>https://readiness.kineticgain.com/risk-benchmarks/</loc></url>
  <url><loc>https://readiness.kineticgain.com/board-brief/</loc></url>
  <url><loc>https://readiness.kineticgain.com/verification/</loc></url>
  <url><loc>https://readiness.kineticgain.com/docs/</loc></url>
</urlset>`,
  [path.join("api", "dashboard", "summary.json")]: JSON.stringify(summary(), null, 2),
  [path.join("api", "agent-readiness.json")]: JSON.stringify(agentReadiness(), null, 2),
  [path.join("api", "risk-benchmarks.json")]: JSON.stringify(riskBenchmarks(), null, 2),
  [path.join("api", "board-brief.json")]: JSON.stringify(boardBrief(), null, 2),
  [path.join("api", "verification.json")]: JSON.stringify(verification(), null, 2),
  [path.join("api", "sample.json")]: JSON.stringify(payload(), null, 2)
};

for (const [relativePath, contents] of Object.entries(files)) {
  const fullPath = path.join(site, relativePath);
  mkdirSync(path.dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, contents);
}
