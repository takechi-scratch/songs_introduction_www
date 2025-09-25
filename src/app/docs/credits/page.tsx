import fs from "fs";
import MyAppShell from "@/components/appshell";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import path from "path";

const credits = fs.readFileSync(path.join(process.cwd(), "public", "docs", "credits.md"), "utf8");

export default function CreditsPage() {
    return (
        <MyAppShell>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{credits}</ReactMarkdown>
        </MyAppShell>
    );
}
