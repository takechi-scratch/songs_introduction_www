export function shuffleArray(array: unknown[]): void {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function estimateComparisons(n: number): number {
    if (n <= 1) return 0;
    let s = 0;
    for (let k = 1; k <= n; k++) s += Math.log2(k);
    return Math.ceil(s);
}
