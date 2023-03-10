const { User } = require("../../db");
const bcryptjs = require("bcryptjs");
const {
  getModels,
  getModelsById,
  postModels,
  putModels,
  deleteModels,
  restoreModels,
  getModelsByEmail,
} = require("../utils/mainUtils");
const { welcomeUser } = require("../../mails/mails");


const getUser = async (req, res) => {
  try {
    const { name } = req.query;
    const users = await getModels(User, name);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await getModelsById(User, id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { mail } = req.body;
    const user = await getModelsByEmail(User, mail);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, name, lastname, email, password, profile_picture, is_private } =
      req.body;
    const passwordHash = await bcryptjs.hash(password, 8);
    const user = await postModels(User, {
      username,
      name,
      lastname,
      email,
      password: passwordHash,
      profile_picture,
      is_private,
    });
    if (user) {
      res.status(200).send("User registered!");
      welcomeUser(name, mail);
    } else {
      res.status(400).send("User couldn't be created");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findAll({
      where: {
        email
      },
    });

    if (user[0]) {
      const compare = await bcryptjs.compare(password, user[0].password);
      if (compare) {
        res.status(200).send("User logged!");
      } else {
        res.status(400).send("Wrong password!");
      }
    } 
    else {
      res.status(400).send("Email doesn't exist!");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const putUser = async (req, res) => {
  try {
    const { id, properties } = req.body;
    const result = await putModels(User, id, properties);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const updated = await deleteModels(User, id);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const restoreUser = async (req, res) => {
  try {
    const { id } = req.body;
    const restored = await restoreModels(User, id);
    res.status(200).json(restored);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getUser,
  getUserById,
  getUserByEmail,
  registerUser,
  loginUser,
  putUser,
  deleteUser,
  restoreUser,
};
