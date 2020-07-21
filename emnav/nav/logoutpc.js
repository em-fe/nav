export default (orgId, self, callback) => {
  const domainStr = self.domain || '';

  setTimeout(() => {
    window.$cookie.remove(`EMTOKEN_${orgId}`, '/', domainStr);
    window.$cookie.remove('EMTOKEN', '/', domainStr);

    /* eslint-disable */
    const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
      for (var i = keys.length; i--;) {
        if (keys[i].indexOf('EMTOKEN') > -1) {
          window.$cookie.remove(keys[i], '/', domainStr);
        }
      }
    }
    callback();
  }, 100);
};
