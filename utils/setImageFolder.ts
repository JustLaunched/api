enum Folder {
  coverImage = 'cover-image',
  logo = 'logo',
  avatar = 'avatar'
}

export const setImageFolder = (path: string) => {
  return new Promise((resolve) => {
    Object.values(Folder).forEach((folder: Folder) => {
      if (path.includes(folder)) {
        resolve(folder);
      }
    });
  })
    .then((folder) => folder)
    .catch(() => 'default');
};
