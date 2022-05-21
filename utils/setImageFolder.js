const folder = {
  coverImage: 'cover-image',
  logo: 'logo',
  avatar: 'avatar'
}

const setImageFolder = (path) => {
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

module.exports = setImageFolder;
