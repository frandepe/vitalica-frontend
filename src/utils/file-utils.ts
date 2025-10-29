export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const filesToBase64Array = async (files: File[]): Promise<string[]> => {
  return Promise.all(files.map((file) => fileToBase64(file)));
};
