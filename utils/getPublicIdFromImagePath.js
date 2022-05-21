function getPublicIdFromImagePath (path) {
  return path.split('/').slice(-2).join('/').split('.').shift();
}

module.exports = getPublicIdFromImagePath;
