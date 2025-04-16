import { execSync } from "child_process";

export function getGitHubToken(): string {
    try {
        const token = execSync("gh auth token", { encoding: "utf-8" }).trim();
        if (!token) {
            throw new Error("Failed to retrieve GitHub token using gh CLI.");
        }
        return token;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error retrieving GitHub token: ${error.message}`);
        }
        throw new Error("Error retrieving GitHub token: An unknown error occurred.");
    }
}