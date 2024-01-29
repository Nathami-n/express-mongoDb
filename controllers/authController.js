const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");

const handleLogin = async () => {
  const { pwd, user } = req.body;
  if (!pwd || !user)
    return res
      .status(400)
      .json({ success: false, message: "Username and password required" });

      const lookupUser = userDB.users.find(usr=> usr.username === user);
      if(!lookupUser) return res.sendStatus(401)// not allowed/unauthorized
      const mathingPassword = await bcrypt.compare(pwd, lookupUser.password);
      if(mathingPassword) {
        res.json({
            success:'true', 
            message: `user ${user} is logged in`
        })
      } else {
        res.sendStatus(401);
      }
};


module.exports = {handleLogin}