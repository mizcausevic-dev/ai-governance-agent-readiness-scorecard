import { describe, expect, it } from "vitest";

import { renderAgentReadiness, renderBoardBrief, renderDocs, renderOverview, renderRiskBenchmarks, renderVerification } from "./render.js";

describe("render", () => {
  it("renders overview copy", () => {
    expect(renderOverview()).toContain("AI Governance & Agent Readiness Scorecard");
    expect(renderOverview()).toContain("readiness score");
  });

  it("renders the readiness route", () => {
    expect(renderAgentReadiness()).toContain("Agent Readiness");
    expect(renderAgentReadiness()).toContain("Policy bundle lane");
  });

  it("renders risk benchmark docs", () => {
    expect(renderDocs()).toContain("/api/agent-readiness");
    expect(renderDocs()).toContain("ai-governance-agent-readiness-scorecard");
  });

  it("renders board brief and verification", () => {
    expect(renderBoardBrief()).toContain("Board Brief");
    expect(renderRiskBenchmarks()).toContain("Risk Benchmarks");
    expect(renderVerification()).toContain("board-safe claims only");
  });
});
