import type { AiGovernanceReadinessExport, Finding, PostureOptions, PostureReport, ReadinessSnapshot } from "./types.js";

function isCurrent(snapshot: ReadinessSnapshot): boolean {
  return snapshot.snapshotStatus === "CURRENT";
}

function includesAny(text: string, needles: string[]): boolean {
  const haystack = text.toLowerCase();
  return needles.some((needle) => haystack.includes(needle));
}

export function analyze(payload: AiGovernanceReadinessExport, options: PostureOptions = {}): PostureReport {
  const now = options.now ?? new Date().toISOString();
  const staleGapAfterHours = options.staleGapAfterHours ?? 24;
  const snapshots = payload.snapshots ?? [];
  const gaps = payload.gaps ?? [];
  const findingsList: Finding[] = [];

  const currentSnapshots = snapshots.filter(isCurrent).length;
  if (currentSnapshots === 0) {
    findingsList.push({
      code: "no-current-readiness-snapshot",
      severity: "high",
      message: "No current executive-readiness snapshot is available for board review.",
      subject: "readiness-snapshot-currentness"
    });
  }

  for (const snapshot of snapshots) {
    if (snapshot.snapshotStatus === "STALE") {
      findingsList.push({
        code: "stale-readiness-snapshot",
        severity: snapshot.riskStatus === "CRITICAL" ? "high" : "medium",
        message: `Readiness snapshot for "${snapshot.name}" is stale and should not anchor a board decision without refresh.`,
        subject: snapshot.id,
        subjectName: snapshot.controlPath,
        scope: snapshot.scope
      });
    }
  }

  for (const gap of gaps) {
    const observed = gap.observedState.toLowerCase();

    if (gap.controlFamily === "PolicyBundle" && includesAny(observed, ["missing", "not approved", "draft only", "unmapped"])) {
      findingsList.push({
        code: "agent-without-policy-bundle",
        severity: gap.blocksBoardReadiness ? "high" : "medium",
        message: `Agent or workflow on "${gap.resourcePath}" does not have a board-safe policy bundle posture.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Identity" && includesAny(observed, ["write scope", "privileged", "production access", "excessive scope"])) {
      findingsList.push({
        code: "privileged-tool-scope-drift",
        severity: gap.blocksBoardReadiness ? "high" : "medium",
        message: `Privileged tool scope is too broad on "${gap.resourcePath}" for a board-ready agent posture.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Eval" && includesAny(observed, ["coverage 42%", "coverage 48%", "coverage gap", "missing eval", "untested"])) {
      findingsList.push({
        code: "eval-coverage-gap",
        severity: gap.blocksBoardReadiness ? "high" : "medium",
        message: `Evaluation coverage is too weak on "${gap.resourcePath}" to support confident investment or rollout decisions.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if ((gap.controlFamily === "Spend" || gap.controlFamily === "Vendor") && includesAny(observed, ["alert disabled", "unbounded", "savings not quantified", "vendor reliance"])) {
      findingsList.push({
        code: "vendor-spend-alert-missing",
        severity: gap.blocksBoardReadiness ? "high" : "medium",
        message: `Spend or vendor control evidence is too thin on "${gap.resourcePath}" to support a savings narrative.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Reporting" && includesAny(observed, ["32 days old", "stale board memo", "no current board pack", "outdated brief"])) {
      findingsList.push({
        code: "board-pack-stale",
        severity: gap.blocksBoardReadiness ? "high" : "medium",
        message: `Board-pack evidence is stale on "${gap.resourcePath}" and weakens the executive story.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "DataBoundary" && includesAny(observed, ["unclear boundary", "unknown residency", "mixed tenant", "cross-tenant"])) {
      findingsList.push({
        code: "data-boundary-unclear",
        severity: gap.blocksBoardReadiness ? "high" : "medium",
        message: `Data-boundary posture is unclear on "${gap.resourcePath}" and should be resolved before board approval.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.gapWindowHours > staleGapAfterHours) {
      findingsList.push({
        code: "high-risk-gap-window",
        severity: gap.gapWindowHours > staleGapAfterHours * 2 ? "medium" : "low",
        message: `Gap on "${gap.resourcePath}" has remained open for ${gap.gapWindowHours} hours.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }
  }

  const blockingGaps = gaps.filter((gap) => gap.blocksBoardReadiness).length;
  const criticalGaps = gaps.filter((gap) => gap.status === "DEGRADED").length;
  const vendorGaps = gaps.filter((gap) => gap.controlFamily === "Spend" || gap.controlFamily === "Vendor").length;
  const boardPackGaps = gaps.filter((gap) => gap.controlFamily === "Reporting").length;
  const avgExposure = snapshots.length > 0 ? snapshots.reduce((sum, snapshot) => sum + snapshot.boardExposureScore, 0) / snapshots.length : 100;
  const readinessPenalty = blockingGaps * 6 + findingsList.filter((item) => item.severity === "high").length * 4;
  const readinessScore = Math.max(0, Math.round(100 - avgExposure / 2 - readinessPenalty));
  const ok = !findingsList.some((finding) => finding.severity === "high");

  return {
    generatedAt: now,
    initiatives: snapshots.length,
    currentSnapshots,
    gaps: gaps.length,
    blockingGaps,
    criticalGaps,
    vendorGaps,
    boardPackGaps,
    readinessScore,
    findingsList,
    ok
  };
}
