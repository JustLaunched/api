export function getPublicIdFromImagePath (path: string) {
  return path.split('/').slice(-2).join('/').split('.').shift();
}
