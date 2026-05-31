`ai-governance-agent-readiness-scorecard` has two layers:

1. Offline analysis
   - reads synthetic executive-readiness snapshot packets
   - identifies policy-bundle gaps, privileged tool-scope drift, evaluation coverage gaps, vendor / spend posture, data-boundary uncertainty, and stale board briefs
   - renders JSON, markdown, and summary views for local review

2. Public executive surface
   - turns the same findings into agent-readiness, risk-benchmark, and board-brief views
   - keeps the proof crawlable for recruiters, buyers, boards, investors, and case-study readers
   - avoids live secrets, tenant credentials, or write paths
