export default (orgId, self, callback) => {
  const domainStr = self.domain || '';

  setTimeout(() => {
    window.$cookie.remove(`EMTOKEN_${orgId}`, '/', domainStr);
    window.$cookie.remove('EMTOKEN', '/', domainStr);
    callback();
  }, 100);
};
