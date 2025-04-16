import { z } from "zod";
import { getGitHubToken } from "../common/utils.js";
import { ToolFunctionMapper } from "../common/types.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

async function getDependabotAlerts(owner: string, repository: string) {
    // Get Dependabot alerts for the GitHub repository
    try {
        const token = getGitHubToken();
        const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/dependabot/alerts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const json = await response.json();
        
        const alerts = []

        if (response.status == 200) {
            for (const alert of json) {
                alerts.push({
                    number: alert.number,
                    state: alert.state,
                    url: alert.html_url,
                    created_at: alert.created_at,
                    severity: alert.security_advisory.severity,
                    summary: alert.security_advisory.summary
                });
            }
        } else {
            alerts.push({
                status: response.status,
                error: json.message
            });
        }

        return alerts;
    } catch (error: Error | any) {
        console.error(error);
        return {
            status: 500,
            error: error.message
        }
    }
}


async function getCodeScanningAlerts(owner: string, repository: string) {
    // Get code scanning alerts for the GitHub repository
    try {
        const token = getGitHubToken();
        const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/code-scanning/alerts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const json = await response.json();

        const alerts = []
        
        if (response.status == 200) {
            for (const alert of json) {
                alerts.push({
                    number: alert.number,
                    state: alert.state,
                    url: alert.html_url,
                    created_at: alert.created_at,
                    rule: alert.rule,
                    tool: alert.tool,
                    fixed_at: alert.fixed_at,
                    dismissed_at: alert.dismissed_at,
                    dismissed_reason: alert.dismissed_reason,
                    dismissed_comment: alert.dismissed_comment
                });
            }
        } else {
            alerts.push({
                status: response.status,
                error: json.message
            });
        }
        return alerts;
    } catch (error: Error | any) {
        console.error(error);
        return {
            status: 500,
            error: error.message
        }
    }
}

async function getSecretScanningAlerts(owner: string, repository: string) {
    // Get secret scanning alerts for the GitHub repository
    try {
        const token = getGitHubToken();
        const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/secret-scanning/alerts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const json = await response.json();

        const alerts = []
        
        if (response.status == 200) {
            for (const alert of json) {
                alerts.push({
                    number: alert.number,
                    state: alert.state,
                    url: alert.html_url,
                    created_at: alert.created_at,
                    resolution: alert.resolution,
                    resolution_comment: alert.resolution_comment,
                    secret_type: alert.secret_type,
                    secret_type_display_name: alert.secret_type_display_name,
                    validity: alert.validity,
                    publicly_leaked: alert.publicly_leaked,
                    multi_repo: alert.multi_repo
                });
            }
        } else {
            alerts.push({
                status: response.status,
                error: json.message
            });
        }
        return alerts;
    } catch (error: Error | any) {
        console.error(error);
        return {
            status: 500,
            error: error.message
        }
    }
}

async function getSecurityStatus(owner: string, repository: string) {
    // Get the security status of the GitHub repository
    try {
        const dependabot_alerts = await getDependabotAlerts(owner, repository);
        const code_scanning_alerts = await getCodeScanningAlerts(owner, repository);
        const secret_scanning_alerts = await getSecretScanningAlerts(owner, repository);

        return {
            "Dependabot Alerts": dependabot_alerts,
            "Code Scanning Alerts": code_scanning_alerts,
            "Secret Scanning Alerts": secret_scanning_alerts
        };
    } catch (error: Error | any) {
        console.error(error);
        return {
            status: 500,
            error: error.message
        }
    }
}

const map_security_state = (server: McpServer) => {
    server.tool(
        "get-security-status",
        "Retrieves the security status of a GitHub repository. This includes Dependabot alerts, code scanning alerts, and secret scanning alerts.",
        {
            owner: z.string(),
            repository: z.string()
        },
        async ({ owner, repository }) => ({
            content: [
                {
                    "type": "text",
                    "text": JSON.stringify(await getSecurityStatus(owner, repository))
                }
            ]
        })
    )
}

export const map_security_tools: ToolFunctionMapper = (server: McpServer) => {
    map_security_state(server);
};
