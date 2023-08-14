const signIn = (req, res) => {};
const getToken = (req) => {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split("Bearer ")[1];
  }
  return null;
};
export { signIn, getToken };
