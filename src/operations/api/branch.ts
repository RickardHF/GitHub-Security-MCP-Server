import { BranchResponseType } from "../../common/types.js";
import { getGitHubToken } from "../../common/utils.js";
import { getRepository } from "./repo.js";

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

export async function listBranches(owner: string, repository: string) {
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

export async function createNewBranch(owner: string, repository: string, branchName: string, baseBranch: string) {
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
