export function replaceWinSlashToUnix(string: string) {
    return string.replaceAll(/\\/g, "/");
}
