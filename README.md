# MCP Server for GitHub Tools

## Overview

This repository contains a Model Context Protocol (MCP) server implementation that provides tools for interacting with GitHub. The server is built using TypeScript and the MCP SDK, allowing it to be integrated with MCP clients like GitHub Copilot in Visual Studio Code.

## Features

The server currently provides the following tools:

- **GitHub User Information**: Retrieve details about a GitHub user by username
- **Security Issue Creation**: Create security issues in GitHub repositories with appropriate formatting and labels
- **List Security Issues**: List all security-related issues in a GitHub repository
- **Security Status Reporting**: Get comprehensive security alerts including Dependabot, code scanning, and secret scanning

## Prerequisites

- Node.js 
- npm (included with Node.js)
- GitHub CLI (gh) installed and authenticated

## Authentication

This MCP server is using the GitHub CLI to get a token for the current authenticated user, and use this for authentication purposes.

## Usage

### Starting the Server

```
npm start
```

For development with automatic rebuilding on file changes:
```
npm run dev
```

For debugging and inspecting the server:
```
npm run inspect
```

### VS Code Integration

#### Running Latest Publised Version

To use the latest publised version, you can choose to add a new tool, select `Command (stdio)` and use the command `npx @rickardhf/github-security-mcp-server`.

If you want to just change the `mcp.json` config file, you can use this configuration
```json
{
    "servers": {
        "my-local-mcp-server": {
            "type": "stdio",
            "command": "npx",
            "args": [
                "@rickardhf/github-security-mcp-server"
            ]
        }
    },
    ...
}
```

#### Running Local Version

To use the local version of the mcp server in your editor you can run the built file of your project in a similar way to what is displayed under here. You simply add this server configuration to the `mcp.json` file, either globally or for that specific workspace. 

```json
{
    "servers": {
        "my-local-mcp-server": {
            "type": "stdio",
            "command": "node",
            "args": [
                "c:\\repos\\private\\mcptest\\dist\\index.js"
            ]
        }
    }
}
```

If you first run the command `npm run local-install` it will install it globally on your local computer. Then you can run it by using the following configuration
```json
{
    "servers": {
        "my-local-mcp-server": {
            "type": "stdio",
            "command": "npx",
            "args": [
                "github-security-mcp-server"
            ]
        }
    }
}
```

### Available Tools

#### Get GitHub User
Retrieves information about a GitHub user.

Example:
```
Get information about the GitHub user "octocat"
```

#### Create Security Issue
Creates a security issue in a GitHub repository with proper formatting and security-related labels.

Example:
```
Create a security issue for XSS vulnerability in the login form
```

#### List Security Issues
Lists all security issues in a GitHub repository that have both the "bug" and "security" labels.

Example:
```
List security issues in the repository "owner/repo-name"
```

#### Get Security Status
Retrieves the security status of a GitHub repository, including:
- Dependabot alerts
- Code scanning alerts
- Secret scanning alerts

Example:
```
Get security status for the repository "owner/repo-name"
```

## Project Structure

- **src/index.ts**: Main entry point and server configuration
- **src/common/**: Shared utilities and type definitions
  - **utils.ts**: Shared utility functions (GitHub token retrieval)
  - **types.ts**: TypeScript type definitions
- **src/operations/**: Tool implementations
  - **process.ts**: Security issue creation functionality

