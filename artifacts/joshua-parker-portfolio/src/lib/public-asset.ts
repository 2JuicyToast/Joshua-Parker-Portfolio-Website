export function publicAsset(filename: string) {
  return `${import.meta.env.BASE_URL}${filename.replace(/^\/+/, '')}`;
}
