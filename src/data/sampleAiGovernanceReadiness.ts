import type { AiGovernanceReadinessExport } from "../types.js";

export const sampleAiGovernanceReadinessPayload: AiGovernanceReadinessExport = {
  snapshots: [
    {
      id: "sales-copilot-agent",
      name: "Sales copilot agent",
      scope: "AGENT_FLEET",
      riskStatus: "WATCH",
      snapshotStatus: "CURRENT",
      controlPath: "/executive-intelligence/ai-governance/sales-copilot-agent",
      owner: "AI Governance Council",
      annualSpendUsd: 780000,
      boardExposureScore: 67,
      collectedAt: "2026-05-31T14:00:00Z"
    },
    {
      id: "support-resolution-agent",
      name: "Support resolution agent",
      scope: "WORKFLOW",
      riskStatus: "CRITICAL",
      snapshotStatus: "STALE",
      controlPath: "/executive-intelligence/ai-governance/support-resolution-agent",
      owner: "CX Platform",
      annualSpendUsd: 1140000,
      boardExposureScore: 81,
      collectedAt: "2026-05-27T09:20:00Z"
    },
    {
      id: "research-analyst-pilot",
      name: "Research analyst pilot",
      scope: "MODEL_STACK",
      riskStatus: "WATCH",
      snapshotStatus: "CURRENT",
      controlPath: "/executive-intelligence/ai-governance/research-analyst-pilot",
      owner: "Platform Strategy",
      annualSpendUsd: 420000,
      boardExposureScore: 59,
      collectedAt: "2026-05-31T11:40:00Z"
    }
  ],
  gaps: [
    {
      id: "gap-policy-bundle",
      snapshotId: "sales-copilot-agent",
      resourcePath: "sales-copilot-agent / production escalation path",
      scope: "AGENT_FLEET",
      controlFamily: "PolicyBundle",
      status: "DEGRADED",
      expectedState: "Decision card and policy bundle are approved before production escalation is enabled.",
      observedState: "Production escalation is enabled while the policy bundle is still draft only.",
      gapWindowHours: 14,
      blocksBoardReadiness: true,
      note: "Commercial rollout is ahead of governance sign-off."
    },
    {
      id: "gap-tool-scope",
      snapshotId: "sales-copilot-agent",
      resourcePath: "sales-copilot-agent / crm-write tool scope",
      scope: "IDENTITY_LAYER",
      controlFamily: "Identity",
      status: "DEGRADED",
      expectedState: "Write scopes stay bounded to reversible, human-reviewed actions.",
      observedState: "Privileged production access still includes excessive write scope for CRM records.",
      gapWindowHours: 22,
      blocksBoardReadiness: true
    },
    {
      id: "gap-eval-coverage",
      snapshotId: "support-resolution-agent",
      resourcePath: "support-resolution-agent / refusal and escalation evals",
      scope: "WORKFLOW",
      controlFamily: "Eval",
      status: "CHANGED",
      expectedState: "Evaluation coverage remains above the launch threshold across escalation paths.",
      observedState: "Coverage 42% on escalation evals after the latest workflow change.",
      gapWindowHours: 39,
      blocksBoardReadiness: true
    },
    {
      id: "gap-spend-alert",
      snapshotId: "research-analyst-pilot",
      resourcePath: "research-analyst-pilot / model vendor spend guardrail",
      scope: "VENDOR_LAYER",
      controlFamily: "Spend",
      status: "DEGRADED",
      expectedState: "Spend alerts stay active and savings assumptions are quantified before broader rollout.",
      observedState: "Spend alert disabled and savings not quantified against the fallback vendor lane.",
      gapWindowHours: 11,
      blocksBoardReadiness: false
    },
    {
      id: "gap-data-boundary",
      snapshotId: "research-analyst-pilot",
      resourcePath: "research-analyst-pilot / retrieval boundary",
      scope: "MODEL_STACK",
      controlFamily: "DataBoundary",
      status: "CHANGED",
      expectedState: "Tenant and data-residency boundary remain explicit in retrieval design.",
      observedState: "Unclear boundary between internal and client-facing retrieval corpora after the latest pilot refresh.",
      gapWindowHours: 19,
      blocksBoardReadiness: true
    },
    {
      id: "gap-board-pack",
      snapshotId: "support-resolution-agent",
      resourcePath: "q2 executive board packet / ai readiness memo",
      scope: "BOARD_PROGRAM",
      controlFamily: "Reporting",
      status: "DEGRADED",
      expectedState: "Board memo is refreshed for the current quarter with current score, savings, and exposure narrative.",
      observedState: "Stale board memo is 32 days old and still references the prior workflow baseline.",
      gapWindowHours: 32,
      blocksBoardReadiness: true
    }
  ]
};

export const readinessLanePackets = [
  {
    id: "policy-lane",
    lane: "Policy bundle lane",
    owner: "AI Governance Council",
    focus: "Decision cards, approval posture, and board-safe control mapping",
    status: "red",
    note: "Policy approval has not caught up to production agent behavior.",
    nextAction: "Freeze new production escalations until the policy bundle is approved."
  },
  {
    id: "identity-lane",
    lane: "Identity and tool-scope lane",
    owner: "Identity Engineering",
    focus: "Privileged tools, reversible actions, and write-scope discipline",
    status: "red",
    note: "Tool scope is still too broad for board-ready confidence.",
    nextAction: "Reduce write scopes and add a human-review gate for CRM mutations."
  },
  {
    id: "evaluation-lane",
    lane: "Evaluation and runtime lane",
    owner: "CX Platform",
    focus: "Escalation evals, refusal coverage, and runtime regression proof",
    status: "yellow",
    note: "Evaluation coverage is visible but below the launch threshold.",
    nextAction: "Expand eval coverage before the next customer-facing rollout."
  },
  {
    id: "board-lane",
    lane: "Board brief lane",
    owner: "CTO Staff",
    focus: "Executive narrative, savings posture, and board-pack freshness",
    status: "yellow",
    note: "The board memo is not current enough to support the next steering review.",
    nextAction: "Refresh the board brief with current score, savings, and exposure language."
  }
] as const;

export const boardBriefPackets = [
  {
    packetId: "AIR-11",
    lane: "Agent governance scorecard",
    owner: "AI Governance Council",
    status: "red",
    completenessScore: 61,
    decisionNote: "The governance spine is visible, but not approved tightly enough to support board confidence.",
    blocker: "Policy bundle remains draft while production escalation is already enabled.",
    launchWindowHours: 8
  },
  {
    packetId: "AIR-18",
    lane: "Privileged tool-scope review",
    owner: "Identity Engineering",
    status: "red",
    completenessScore: 58,
    decisionNote: "Identity and tool-scope evidence is too weak to defend a clean risk narrative.",
    blocker: "Privileged CRM write scope is still broader than the approved operator boundary.",
    launchWindowHours: 10
  },
  {
    packetId: "AIR-24",
    lane: "Savings and vendor posture",
    owner: "FinOps",
    status: "yellow",
    completenessScore: 73,
    decisionNote: "Savings signals exist, but spend controls and vendor-replacement evidence are incomplete.",
    blocker: "Spend alerting is disabled and fallback-vendor savings are not quantified.",
    launchWindowHours: 16
  },
  {
    packetId: "AIR-31",
    lane: "Board brief packet",
    owner: "CTO Staff",
    status: "yellow",
    completenessScore: 68,
    decisionNote: "The board narrative is close, but too stale to take into a live steering conversation.",
    blocker: "Board-ready memo still references the prior-quarter workflow baseline.",
    launchWindowHours: 24
  }
] as const;
