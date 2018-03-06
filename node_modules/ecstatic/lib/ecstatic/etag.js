'use strict';

module.exports = (stat, weakEtag) => {
  let etag = `"${[stat.ino, stat.size, JSON.stringify(stat.mtime)].join('-')}"`;
  if (weakEtag) {
    etag = `W/${etag}`;
  }
  return etag;
};
