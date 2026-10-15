export function publicAsset(filename: string) {
  const filePath = filename.replace(/^\/+/, '');
  const outputDirectory = import.meta.env.MODE === 'github-pages' ? 'assets/' : '';
  return `${import.meta.env.BASE_URL}${outputDirectory}${filePath}`;
}
