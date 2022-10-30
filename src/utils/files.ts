export interface IOpenFilesOptions {
  directory?: boolean;
  accept?: string[];
}

export async function openFiles({ accept }: IOpenFilesOptions = {}) {
  const input = document.createElement('input');
  input.type = 'file';
  if (accept) {
    input.accept = accept.join(',');
  }
  return new Promise<FileList | null>((resolve, reject) => {
    document.body.appendChild(input);
    input.remove();
    input.click();
    input.onchange = async () => {
      resolve(input.files);
    };
  });
}

export function basename(path: string) {
  return path.replace(/^.*[\\/]/, '');
}
