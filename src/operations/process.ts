import { z } from "zod";
import { 
    ToolFunctionMapper, 
} from "../common/types.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { createPullRequest, getPullRequest } from "./api/pull-requests.js";
import { createSecurityIssueFunction, listSecurityIssues } from "./api/issues.js";
import { createNewBranch, listBranches } from "./api/branch.js";


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
                    "text": JSON.stringify(await createSecurityIssueFunction(owner, repository, title, body, assignees))
                }
            ]
        })
    )
}

const map_create_new_branch = (server: McpServer) => {
    server.tool(
        "create-new-branch",
        "Create a new branch in a GitHub repository.",
        {
            owner: z.string(),
            repository: z.string(),
            branchName: z.string(),
            baseBranch: z.string()
        },
        async ({ owner, repository, branchName, baseBranch }) => ({
            content: [
                {
                    "type": "text",
                    "text": JSON.stringify(await createNewBranch(owner, repository, branchName, baseBranch))
                }
            ]
        })
    )
}

const map_create_new_pull_request = (server: McpServer) => {
    server.tool(
        "create-new-pull-request",
        "Create a new pull request in a GitHub repository.",
        {
            owner: z.string(),
            repository: z.string(),
            branchName: z.string(),
            baseBranch: z.string(),
            title: z.string(),
            body: z.string()
        },
        async ({ owner, repository, branchName, baseBranch, title, body }) => ({
            content: [
                {
                    "type": "text",
                    "text": JSON.stringify(await createPullRequest(owner, repository, branchName, baseBranch, title, body))
                }
            ]
        })
    )
}

const map_get_pull_request = (server: McpServer) => {
    server.tool(
        "get-pull-request",
        "Get a pull request in a GitHub repository.",
        {
            owner: z.string(),
            repository: z.string(),
            pullNumber: z.number()
        },
        async ({ owner, repository, pullNumber }) => ({
            content: [
                {
                    "type": "text",
                    "text": JSON.stringify(await getPullRequest(owner, repository, pullNumber))
                }
            ]
        })
    )
}

const map_list_branches = (server: McpServer) => {
    server.tool(
        "list-branches",
        "List branches in a GitHub repository.",
        {
            owner: z.string(),
            repository: z.string()
        },
        async ({ owner, repository }) => ({
            content: [
                {
                    "type": "text",
                    "text": JSON.stringify(await listBranches(owner, repository))
                }
            ]
        })
    )
}

export const map_process_tools: ToolFunctionMapper = (server: McpServer) => {
    map_create_security_issue(server);
    map_list_security_issues(server);
    map_create_new_branch(server);
    map_create_new_pull_request(server);
    map_list_branches(server);
    map_get_pull_request(server);
};
