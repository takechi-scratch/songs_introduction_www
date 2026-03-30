const RESTRICTED_NAMES = ["admin", "editor", "管理者", "編集者", "公式", "運営", "スタッフ"];

export function validateDisplayName(displayName: string, isAdmin: boolean = false): string | null {
    if (displayName.length > 30) {
        return "名前は最大30文字までです。";
    } else if (
        !isAdmin &&
        RESTRICTED_NAMES.some((name) => displayName.toLowerCase().includes(name))
    ) {
        return "利用できないキーワードが含まれています。";
    }
    return null;
}
