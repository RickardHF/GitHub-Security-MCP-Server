import { getGitHubToken } from "../../common/utils.js";

export async function createSecurityIssueFunction(owner: string, repository: string, title: string, body: string, assignees: string[]) {
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

export async function listSecurityIssues(owner: string, repository: string) {
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