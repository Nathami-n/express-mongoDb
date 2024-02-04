const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");
const { writeFile } = require("fs").promises;
const jwt = require("jsonwebtoken");
require('dotenv').config();
const path = require('path')

const handleLogin = async (req,res) => {
  const { pwd, user } = req.body;
  if (!pwd || !user)
    return res 
      .status(400)
      .json({ success: false, message: "Username  and password required" });

      const lookupUser = userDB.users.find(usr=> usr.username === user);
      if(!lookupUser) return res.sendStatus(401)// not allowed/unauthorized
      const mathingPassword = await bcrypt.compare(pwd, lookupUser.password);
      if(mathingPassword) {
        const accessToken = jwt.sign(
          {"username":lookupUser.username},
          process.env.ACCESS_TOKEN_SECRET,
          {expiresIn:'30s'}

        )
        const refreshToken = jwt.sign(
          {"username":lookupUser.username},
          process.env.REFRESH_TOKEN_SECRET,
          {expiresIn:'1d'}

        )
        const restUsers = userDB.users.filter(person => person.username !== lookupUser.username)
        const currentUser = {...lookupUser, refreshToken}
        userDB.setUsers([...restUsers, currentUser])
        await writeFile(
          path.join(__dirname, '..', 'users.json'),
          JSON.stringify(userDB.users)
        )
        res.cookie('jwt', refreshToken, {httpOnly:true, maxAge: 24*60*60*1000});
        res.json({
          accessToken
        })

      } else {
        res.sendStatus(401);
      }
};


module.exports = {handleLogin}