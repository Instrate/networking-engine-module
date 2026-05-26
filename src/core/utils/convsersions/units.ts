const modifier = 1024 as const;

const kb = modifier;
const mb = kb * modifier;
const gb = mb * modifier;

export function truncWithTail(val: number, digitsAmountToKeep: number = 0) {
    const num = Math.pow(10, digitsAmountToKeep);
    const upper = val * num;
    const truncated = Math.trunc(upper);
    return truncated / num;
}

export function bytesToGb(val: number, fraction: number = 1) {
    return truncWithTail(val / gb, fraction);
}
