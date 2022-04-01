export function generateNonce():number {
    return (Math.random() * (100000000000 - 0) + 0);
}