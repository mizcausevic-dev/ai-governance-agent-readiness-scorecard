export type ScopeKind = "BOARD_PROGRAM" | "AGENT_FLEET" | "MODEL_STACK" | "IDENTITY_LAYER" | "VENDOR_LAYER" | "WORKFLOW";
export type RiskHealth = "HEALTHY" | "WATCH" | "CRITICAL";
export type SnapshotStatus = "CURRENT" | "STALE";
export type GapStatus = "ADDED" | "REMOVED" | "CHANGED" | "DEGRADED";
export type ControlFamily =
  | "PolicyBundle"
  | "PromptGovernance"
  | "Identity"
  | "Observability"
  | "Spend"
  | "Vendor"
  | "Eval"
  | "DataBoundary"
  | "Reporting";

export interface ReadinessSnapshot {
  id: string;
  name: string;
  scope: ScopeKind;
  riskStatus: RiskHealth;
  snapshotStatus: SnapshotStatus;
  controlPath: string;
  owner: string;
  annualSpendUsd: number;
  boardExposureScore: number;
  collectedAt: string;
}

export interface ReadinessGap {
  id: string;
  snapshotId: string;
  resourcePath: string;
  scope: ScopeKind;
  controlFamily: ControlFamily;
  status: GapStatus;
  expectedState: string;
  observedState: string;
  gapWindowHours: number;
  blocksBoardReadiness?: boolean;
  note?: string;
}

export interface AiGovernanceReadinessExport {
  snapshots?: ReadinessSnapshot[];
  gaps?: ReadinessGap[];
}

export type FindingSeverity = "high" | "medium" | "low" | "info";

export type FindingCode =
  | "no-current-readiness-snapshot"
  | "stale-readiness-snapshot"
  | "agent-without-policy-bundle"
  | "privileged-tool-scope-drift"
  | "eval-coverage-gap"
  | "vendor-spend-alert-missing"
  | "board-pack-stale"
  | "data-boundary-unclear"
  | "high-risk-gap-window";

export interface Finding {
  code: FindingCode;
  severity: FindingSeverity;
  message: string;
  subject: string;
  subjectName?: string;
  scope?: ScopeKind;
  controlFamily?: ControlFamily;
}

export interface PostureReport {
  generatedAt: string;
  initiatives: number;
  currentSnapshots: number;
  gaps: number;
  blockingGaps: number;
  criticalGaps: number;
  vendorGaps: number;
  boardPackGaps: number;
  readinessScore: number;
  findingsList: Finding[];
  ok: boolean;
}

export interface PostureOptions {
  now?: string;
  staleGapAfterHours?: number;
}
