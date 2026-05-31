// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { boardBriefPackets, readinessLanePackets, sampleAiGovernanceReadinessPayload } from "../data/sampleAiGovernanceReadiness.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-31T00:00:00Z";
const report = analyze(sampleAiGovernanceReadinessPayload, {
  now: NOW,
  staleGapAfterHours: 24
});

function severityRank(finding: Finding): number {
  return finding.severity === "high" ? 0 : finding.severity === "medium" ? 1 : finding.severity === "low" ? 2 : 3;
}

export function summary() {
  return {
    initiatives: report.initiatives,
    currentSnapshots: report.currentSnapshots,
    readinessScore: report.readinessScore,
    gaps: report.gaps,
    blockingGaps: report.blockingGaps,
    criticalGaps: report.criticalGaps,
    vendorGaps: report.vendorGaps,
    boardPackGaps: report.boardPackGaps,
    highFindings: report.findingsList.filter((finding) => finding.severity === "high").length,
    recommendation:
      "Tighten policy bundles, privileged tool scope, evaluation coverage, and board-pack freshness before calling AI readiness investable."
  };
}

export function agentReadiness() {
  return readinessLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "policy-lane") return finding.code === "agent-without-policy-bundle";
      if (lane.id === "identity-lane") return finding.code === "privileged-tool-scope-drift";
      if (lane.id === "evaluation-lane") return finding.code === "eval-coverage-gap" || finding.code === "data-boundary-unclear";
      if (lane.id === "board-lane") return finding.code === "board-pack-stale" || finding.code === "vendor-spend-alert-missing";
      return false;
    }).length
  }));
}

export function riskBenchmarks() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.code === "agent-without-policy-bundle"
          ? "AI Governance Council"
          : finding.code === "privileged-tool-scope-drift"
            ? "Identity Engineering"
            : finding.code === "eval-coverage-gap"
              ? "CX Platform"
              : finding.code === "vendor-spend-alert-missing"
                ? "FinOps"
                : finding.code === "board-pack-stale"
                  ? "CTO Staff"
                  : finding.code === "data-boundary-unclear"
                    ? "Platform Strategy"
                    : "AI Governance Council"
    }));
}

export function boardBrief() {
  return boardBriefPackets;
}

export function verification() {
  return [
    "The scorecard is backed by a real offline analyzer and CLI, not static positioning copy alone.",
    "Snapshots and evidence gaps are synthetic sample data only; no live tenant credentials, vendor secrets, or production write paths are published.",
    "The control plane keeps policy bundles, privileged scopes, evaluation coverage, vendor spend, and board-pack freshness visible in one executive view.",
    "This surface is meant to answer board and investor questions about exposure, savings, and investment priority.",
    "It is the front door for later board briefs, diligence packs, and vendor-replacement narratives."
  ];
}

export function payload() {
  return {
    summary: summary(),
    agentReadiness: agentReadiness(),
    riskBenchmarks: riskBenchmarks(),
    boardBrief: boardBrief(),
    verification: verification(),
    sample: sampleAiGovernanceReadinessPayload
  };
}
