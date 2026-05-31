import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { AiGovernanceReadinessExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): AiGovernanceReadinessExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as AiGovernanceReadinessExport;

const NOW = "2026-05-31T08:00:00Z";

describe("analyze", () => {
  it("counts initiatives and executive gap families", () => {
    const report = analyze(fixture("ai-governance-readiness.json"), { now: NOW });
    expect(report.initiatives).toBe(3);
    expect(report.currentSnapshots).toBe(2);
    expect(report.gaps).toBe(6);
    expect(report.blockingGaps).toBe(5);
    expect(report.vendorGaps).toBe(1);
    expect(report.boardPackGaps).toBe(1);
  });

  it("flags policy and tool-scope issues as high", () => {
    const report = analyze(fixture("ai-governance-readiness.json"), { now: NOW });
    expect(report.findingsList.find((item) => item.code === "agent-without-policy-bundle")?.severity).toBe("high");
    expect(report.findingsList.find((item) => item.code === "privileged-tool-scope-drift")?.severity).toBe("high");
  });

  it("flags evaluation and board-pack gaps", () => {
    const report = analyze(fixture("ai-governance-readiness.json"), { now: NOW });
    expect(report.findingsList.find((item) => item.code === "eval-coverage-gap")).toBeDefined();
    expect(report.findingsList.find((item) => item.code === "board-pack-stale")).toBeDefined();
  });

  it("returns ok=true on a clean fixture", () => {
    const report = analyze(fixture("ai-governance-readiness-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((item) => item.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("renders findings in markdown", () => {
    const markdown = toMarkdown(analyze(fixture("ai-governance-readiness.json"), { now: NOW }));
    expect(markdown).toContain("AI governance readiness needs work");
    expect(markdown).toContain("agent-without-policy-bundle");
  });

  it("renders clean markdown and summary", () => {
    const report = analyze(fixture("ai-governance-readiness-clean.json"), { now: NOW });
    expect(toMarkdown(report)).toContain("AI governance readiness is board-safe");
    expect(toMarkdown(report)).toContain("No findings.");
    expect(toSummary(report)).toMatch(/^2 initiatives/);
  });
});
