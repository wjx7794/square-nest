export function logger(req, res, next) {
  const { url, method } = req || {};
  const passport = req.signedCookies?.passport;
  const { userId, userName } = passport?.userInfo || {};
  console.log(`${method} ${url} ${userName} ${userId}`);
  next();
}
