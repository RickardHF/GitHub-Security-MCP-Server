# MCP Server for GitHub Tools

## Overview

This repository contains a Model Context Protocol (MCP) server implementation that provides tools for interacting with GitHub. The server is built using TypeScript and the MCP SDK, allowing it to be integrated with MCP clients like GitHub Copilot in Visual Studio Code.

## Features

The server currently provides the following tools:

- **GitHub User Information**: Retrieve details about a GitHub user by username
- **Security Issue Creation**: Create security issues in GitHub repositories with appropriate formatting and labels
- **List Security Issues**: List all security-related issues in a GitHub repository
- **Security Status Reporting**: Get comprehensive security alerts including Dependabot, code scanning, and secret scanning
- **Branch Management**: List branches and create new branches in a GitHub repository
- **Pull Request Creation**: Create pull requests between branches

## Prerequisites

- Node.js 
- npm (included with Node.js)
- GitHub CLI (gh) installed and authenticated

## Authentication

This MCP server is using the GitHub CLI to get a token for the current authenticated user, and use this for authentication purposes.

## Running Locally

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

## Usage

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

#### List Branches
Lists all branches in a GitHub repository with information about the latest commit, protection status, and whether it's the default branch.

Example:
```
List branches in the repository "owner/repo-name"
```

#### Create New Branch
Creates a new branch in a GitHub repository based on an existing branch.

Example:
```
Create a new branch called "feature-branch" based on "main" in "owner/repo-name"
```

#### Create Pull Request
Creates a new pull request between two branches in a GitHub repository.

Example:
```
Create a pull request from "feature-branch" to "main" in "owner/repo-name" titled "New Feature Implementation"
```

### AI Agent not picking up on the tools

Sometimes we experience that the AI agents are not piking up on the tools, like in the following example. Specifying that it should use tools seems to work.

![image](https://github.com/user-attachments/assets/7e2e0d26-0c59-42ae-a6f0-50fadd0b3ea7)


## Project Structure

- **src/index.ts**: Main entry point and server configuration
- **src/common/**: Shared utilities and type definitions
  - **utils.ts**: Shared utility functions (GitHub token retrieval)
  - **types.ts**: TypeScript type definitions
- **src/operations/**: Tool implementations
  - **process.ts**: Tool registration and mapping
  - **security.ts**: Security status reporting functionality
  - **api/**: GitHub API operations
    - **branch.ts**: Branch management operations
    - **issues.ts**: Security issue operations
    - **pull-requests.ts**: Pull request operations
    - **repo.ts**: Repository operations

