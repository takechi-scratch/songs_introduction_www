import fs from "fs";
import MyAppShell from "@/components/appshell";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import path from "path";

const terms = fs.readFileSync(path.join(process.cwd(), "public", "terms.md"), "utf8");

export default function TermsPage() {
    return (
        <MyAppShell>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{terms}</ReactMarkdown>
        </MyAppShell>
    );
}
