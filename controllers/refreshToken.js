const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401);
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;


  const lookupUser = userDB.users.find((usr) => usr.refreshToken === refreshToken);
  if (!lookupUser) return res.sendStatus(401); // not allowed/unauthorized
  const mathingPassword = bcrypt.compare(pwd, lookupUser.password);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,decoded) => {
        if(err|| lookupUser.username != decoded.username) return res.sendStatus(403);
        console.log(decoded)
        const accessToken = jwt.sign(
            {"username": decoded.username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30s'}
        )
    } )

    res.json({accessToken})
}
    

module.exports = { handleRefreshToken }
