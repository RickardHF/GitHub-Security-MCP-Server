import { z } from "zod";
import { getGitHubToken } from "../common/utils.js";
import { 
    ToolFunctionMapper, 
    BranchResponseType,
    RepoResponseType 
} from "../common/types.js";
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

async function listBranches(owner: string, repository: string) {
    // List branches in the GitHub repository
    try {
        const token = getGitHubToken();
        const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/branches`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const json = await response.json();

        const repo = await getRepository(owner, repository);
        if (repo.error) {
            throw new Error(`Error getting repository: ${repo.error}`);
        }

        const branches = json.map((branch: any) => {
            return {
                name: branch.name,
                latest_commit: branch.commit.sha,
                protected: branch.protected,
                default: branch.name === repo.default_branch
            }
        });
        return branches;
    } catch (error: Error | any) {
        console.error(error);
        return {
            status: 500,
            error: error.message
        }
    }
}

async function getBranch(owner: string, repository: string, branchName: string): Promise<BranchResponseType> {
    // Get a branch in the GitHub repository
    const defaultBranchResponse : BranchResponseType = {
        name: undefined,
        sha: undefined,
        status: undefined,
        error: undefined
    } 
    try {
        const token = getGitHubToken();
        const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/git/refs/heads/${branchName}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const json = await response.json();

        const branch: BranchResponseType = {
            ...defaultBranchResponse,
            name: json.name,
            sha: json.commit.sha
        }
        return branch;
    } catch (error: Error | any) {
        console.error(error);
        return {
            ...defaultBranchResponse,
            status: 500,
            error: error.message
        }
    }
}

async function getRepository(owner: string, repository: string): Promise<Partial<RepoResponseType>> {
    // Get a repository in the GitHub organization
    try {
        const token = getGitHubToken();
        const response = await fetch(`https://api.github.com/repos/${owner}/${repository}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const json = await response.json();

        const repo = {
            id: json.id,
            name: json.name,
            full_name: json.full_name,
            description: json.description,
            private: json.private,
            default_branch: json.default_branch,
        }
        return repo;
    } catch (error: Error | any) {
        console.error(error);
        return {
            status: 500,
            error: error.message
        }
    }
    
}

async function createNewBranch(owner: string, repository: string, branchName: string, baseBranch: string) {
    // Create a new branch in the GitHub repository
    try {
        const token = getGitHubToken();

        // Get the base branch SHA instead of the branch we're creating
        const baseBranchInfo = await getBranch(owner, repository, baseBranch);
        
        if (baseBranchInfo.error) {
            throw new Error(`Error getting base branch: ${baseBranchInfo.error}`);
        }

        const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/git/refs`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28"
            },            body: JSON.stringify({
                ref: `refs/heads/${branchName}`,
                sha: baseBranchInfo.sha
            })
        });
        const json = await response.json();
        return {
            status: response.status,
            url: json.url
        }
    } catch (error: Error | any) {
        console.error(error);
        return {
            status: 500,
            error: error.message
        }
    }
}

async function createPullRequest(owner: string, repository: string, branchName: string, baseBranch: string, title: string, body: string) {
    // Create a pull request in the GitHub repository
    try {
        const token = getGitHubToken();
        const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/pulls`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28"
            },
            body: JSON.stringify({
                title,
                body,
                head: branchName,
                base: baseBranch
            })
        });
        const json = await response.json();
        return {
            status: response.status,
            url: json.url
        }
    } catch (error: Error | any) {
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
};
