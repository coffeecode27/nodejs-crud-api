import bcrypt from "bcrypt";


const createUser = async (req, res) => {
  if (req.body.username == "") {
    return res.status(401).send({ message: "Failed! Username is not null" });
  } else if (req.body.password == "") {
    return res.status(401).send({ message: "Failed! Password is not null" });
  } else {
    try {
      const salt = await bcrypt.genSalt(10);
      const passHash = await bcrypt.hash(req.body.password, salt);
      const user = await req.context.models.users.create({
        username: req.body.username,
        user_password: passHash,
      });
      const { username } = user.dataValues;
      return res.status(200).send({message:`${username} successfully created!`})
    } catch (error) {
      return res.status(500).send({ message: "Failed to create user. Please try again later." });
    }
  }
};

export default {
    createUser
}