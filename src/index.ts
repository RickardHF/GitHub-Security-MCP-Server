#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getGitHubToken } from "./common/utils.js";
import { map_process_tools } from "./operations/process.js";
import { map_security_tools } from "./operations/security.js";

// Create an MCP server
const server = new McpServer({
    name: "RickardHF's MCP Server",
    description: "A Model Context Protocol server created by RickardHF.",
    version: "1.0.0"
});

server.tool("get-github-user",
    "Get GitHub user information based on the username.",
    { username: z.string() },
    async ({ username }) => ({
        content: [{
            type: "text",
            text: await getGithubUser({ username })
        }]
    }) 
);

map_process_tools(server);
map_security_tools(server);

async function getGithubUser({ username }: { username: string }): Promise<string> {
    const token = getGitHubToken();
    const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
            Authorization: `token ${token}`
        }
    });
    const user = await response.json();
    return JSON.stringify(user, null, 2);
}

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();

// Wrap in async function to use await
await server.connect(transport);