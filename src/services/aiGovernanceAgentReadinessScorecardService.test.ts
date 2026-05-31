import { describe, expect, it } from "vitest";

import { agentReadiness, boardBrief, payload, riskBenchmarks, summary, verification } from "./aiGovernanceAgentReadinessScorecardService.js";

describe("aiGovernanceAgentReadinessScorecardService", () => {
  it("returns summary metrics", () => {
    expect(summary().initiatives).toBe(3);
    expect(summary().highFindings).toBeGreaterThan(0);
  });

  it("returns one readiness-lane item per packet", () => {
    expect(agentReadiness()).toHaveLength(4);
  });

  it("sorts high findings first", () => {
    const findings = riskBenchmarks();
    expect(findings[0]?.severity).toBe("high");
  });

  it("returns board brief packets", () => {
    expect(boardBrief()).toHaveLength(4);
  });

  it("returns verification claims and payload", () => {
    expect(verification()).toHaveLength(5);
    expect(payload().sample).toBeDefined();
  });
});
