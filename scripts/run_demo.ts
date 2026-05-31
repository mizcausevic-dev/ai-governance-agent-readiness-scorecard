import { agentReadiness, boardBrief, riskBenchmarks, summary } from "../src/services/aiGovernanceAgentReadinessScorecardService.js";

console.log("ai-governance-agent-readiness-scorecard demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(`${agentReadiness().length} readiness lanes`);
console.log(`${riskBenchmarks().length} risk findings`);
console.log(`${boardBrief().length} board brief packets`);
