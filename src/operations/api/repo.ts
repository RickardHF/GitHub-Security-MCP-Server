import { RepoResponseType } from "../../common/types";
import { getGitHubToken } from "../../common/utils.js";

export async function getRepository(owner: string, repository: string): Promise<Partial<RepoResponseType>> {
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