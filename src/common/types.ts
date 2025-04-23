import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

export type ToolFunctionMapper = (server: McpServer) => void;

type ErrorResponse = { status: number, error: string };

export type RepoResponseType = Partial<ErrorResponse> & {
    name: string | undefined, 
    full_name: string | undefined, 
    private: boolean | undefined, 
    description: string | undefined,
    default_branch: string | undefined 
};

export type BranchResponseType = Partial<ErrorResponse> & { 
    name: string | undefined, 
    sha: string | undefined
};

export type PullRequestDiff = Partial<ErrorResponse> & {
    diff: string
};

type PullRequestComment = {
    id: number,
    user: string,
    body: string,
    diff_hunk: string,
    subject_type: string,
    path: string,
    position: number,
    original_position: number,
    commit_id: string,
    original_commit_id: string,
    start_line: number,
    original_start_line: number,
    line: number,
    original_line: number
};

export type PullRequestComments = Partial<ErrorResponse> & {
    comments: Partial<PullRequestComment>[]
};
