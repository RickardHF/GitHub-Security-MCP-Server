import { PullRequestComments, PullRequestDiff } from "../../common/types";
import { getGitHubToken } from "../../common/utils.js";

export async function createPullRequest(owner: string, repository: string, branchName: string, baseBranch: string, title: string, body: string) {
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
            url: json.url,
            id: json.id,
            state: json.state,
            title: json.title,
            number: json.number
        }
    } catch (error: Error | any) {
        console.error(error);
        return {
            status: 500,
            error: error.message
        }
    }
}

export async function getPullRequest(owner: string, repository: string, pullNumber: number) {
    // Get a pull request in the GitHub repository
    try {
        const token = getGitHubToken();
        const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/pulls/${pullNumber}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const json = await response.json();

        const diff = await getPullRequestDiff(owner, repository, pullNumber);
        if (diff.error) {
            throw new Error(`Error getting pull request diff: ${diff.error}`);
        }

        const comments = await getPullRequestComments(owner, repository, pullNumber);
        if (comments.error) {
            throw new Error(`Error getting pull request comments: ${comments.error}`);
        }

        return {
            id: json.id,
            number: json.number,
            state: json.state,
            title: json.title,
            body: json.body,
            diff: diff.diff,
            comments: comments.comments
        };
    } catch (error: Error | any) {
        console.error(error);
        return {
            status: 500,
            error: error.message
        }
    }
}

async function getPullRequestDiff(owner: string, repository: string, pullNumber: number) : Promise<Partial<PullRequestDiff>> {
    // Get the diff of a pull request in the GitHub repository
    try {
        const token = getGitHubToken();
        const response = await fetch(`https://github.com/${owner}/${repository}/pull/${pullNumber}.diff`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const json = await response.text();
        return {
            diff: json
        };
    } catch (error: Error | any) {
        console.error(error);
        return {
            status: 500,
            error: error.message
        }
    }
}


async function getPullRequestComments(owner: string, repository: string, pullNumber: number) : Promise<Partial<PullRequestComments>> {
    // Get comments on a pull request in the GitHub repository
    try {
        const token = getGitHubToken();
        const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/pulls/${pullNumber}/comments`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const json = await response.json();

        const comments = json.map((comment: any) => {
            return {
                id: comment.id,
                diff_hunk: comment.diff_hunk,
                body: comment.body,
                subject_type: comment.subject_type,
                path: comment.path,
                position: comment.position,
                original_position: comment.original_position,
                commit_id: comment.commit_id,
                original_commit_id: comment.original_commit_id,
                start_line: comment.start_line,
                original_start_line: comment.original_start_line,
                line: comment.line,
                original_line: comment.original_line,
                user: comment.user.login
            }
        });

        return {
            comments: comments
        };
    } catch (error: Error | any) {
        console.error(error);
        return {
            status: 500,
            error: error.message
        }
    }
}
