import { z } from "zod";
import { getGitHubToken } from "../common/utils.js";
import { ToolFunctionMapper } from "../common/types.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

async function CreateSecurityIssueFunction(owner: string, repository: string, title: string, body: string, assignees: string[]) {
    // Create a security issue in the GitHub repository
    try {        
        const token = getGitHubToken();
        const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/issues`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28"
            },
            body: JSON.stringify({
                title: ":warning: [ Security Issue ] - " + title,
                body,
                type: "bug",
                labels: ["security", "bug"],
                assignees: assignees
            })
        });
        const json = await response.json();
        return {
            status: response.status,
            url: json.url
        }
    } catch (error: Error | any ) {
        console.error(error);
        return {
            status: 500,
            error: error.message
        }
    }
}

async function listSecurityIssues(owner: string, repository: string) {
    // List security issues in the GitHub repository
    try {
        const token = getGitHubToken();
        const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/issues?labels=bug,security`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const json = await response.json();
        return json;
    } catch (error: Error | any) {
        console.error(error);
        return {
            status: 500,
            error: error.message
        }
    }
}

const map_list_security_issues = (server: McpServer) => {
    server.tool(
        "list-security-issues",
        "List security issues in a GitHub repository.",
        {
            owner: z.string(),
            repository: z.string()
        },
        async ({ owner, repository }) => ({
            content: [
                {
                    "type": "text",
                    "text": JSON.stringify(await listSecurityIssues(owner, repository))
                }
            ]
        })
    )
}

const map_create_security_issue = (server: McpServer) => {
    server.tool(
        "create-security-issue",
        "Create security issues in a GitHub repository.",
        {
            owner: z.string(),
            repository: z.string(),
            title: z.string(),
            body: z.string(),
            assignees: z.array(z.string())
        },
        async ({ owner, repository, title, body, assignees }) => ({
            content: [
                {
                    "type": "text",
                    "text": JSON.stringify(await CreateSecurityIssueFunction(owner, repository, title, body, assignees))
                }
            ]
        })
    )
}

export const map_process_tools: ToolFunctionMapper = (server: McpServer) => {
    map_create_security_issue(server);
    map_list_security_issues(server);
};
