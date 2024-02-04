const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const {writeFile} = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
  const { pwd, user } = req.body;
  if (!pwd || !user)
    return res
      .status(400)
      .json({ success: false, message: "Username and password required" });

  const duplicate = userDB.users.find((usr) => usr.username === user);
  if (duplicate) return res.sendStatus(409)//duplicate user;
  try {
    const hashedPassword = await bcrypt.hash(pwd, 10);
    const newUser = { "username": user, "password": hashedPassword };
    userDB.setUsers([...userDB.users, newUser]);
    await writeFile(path.resolve(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users));
    console.log(userDB.users);
    res
      .status(201)
      .json({ success: true, message: "user created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message }) // server error;j
  }
};

module.exports = { handleNewUser };
