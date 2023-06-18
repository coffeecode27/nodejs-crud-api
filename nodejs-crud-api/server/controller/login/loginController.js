import bcrypt from 'bcrypt';
import models from '../../models/init-models';
import { generateToken } from '../../../auth/auth';

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await models.users.findOne({ where: { username } });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.user_password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid password' });
    }
    const token = generateToken(user.user_id);
    return res.status(200).send({message:'Login Success!',username, accesstoken:token });

  } catch (error) {
    return res.status(500).send({ message: 'Failed to login', error });
  }
};

export default { loginUser };
