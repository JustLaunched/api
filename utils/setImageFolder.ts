const folder = {
  coverImage: 'cover-image',
  logo: 'logo',
  avatar: 'avatar'
}

export const setImageFolder = (path: string) => {
  return new Promise((resolve) => {
    Object.values(folder).forEach((folder) => {
      if (path.includes(folder)) {
        resolve(folder);
      }
    });
  })
    .then((folder) => folder)
    .catch(() => 'default');
};
