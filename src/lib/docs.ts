import { promises as fs } from "fs";
import { join } from "path";

export const fetchDocsFile = async (path: string[]) => {
    try {
        const response = await fs.readFile(
            join(process.cwd(), `public/docsFiles/${path.join("/")}.md`),
            {
                encoding: "utf-8",
            }
        );

        if (!response) {
            return "404 | 指定されたファイルが見つかりません";
        }

        return response;
    } catch (error) {
        if (error instanceof Error && error.message.includes("ENOENT")) {
            throw new Error("404 | 指定されたドキュメントファイルが見つかりません");
        }
        console.error(`Failed to fetch docs ${path.join("/")}:`, error);
        throw error;
    }
};
