export function createUrl(content: string | ArrayBuffer, contentType: string) {
  try {
    return URL.createObjectURL(new Blob([content], { type: contentType }));
  } catch (e) {
    if (typeof content === 'string') {
      console.error(e);
      return `data:${contentType};base64,` + btoa(content);
    }
    throw e;
  }
}

export function downloadURL(url: string, filename: string) {
  const link: HTMLAnchorElement = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadFile(
  filename: string,
  content: string | ArrayBuffer,
  contentType: string = 'application/octet-stream',
) {
  downloadURL(createUrl(content, contentType), filename);
}
