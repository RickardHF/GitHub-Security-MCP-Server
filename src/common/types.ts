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