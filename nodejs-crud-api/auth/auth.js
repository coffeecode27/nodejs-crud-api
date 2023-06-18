import jwt from 'jsonwebtoken';
import models from '../server/models/init-models';

// Fungsi untuk menghasilkan JWT
const generateToken = (userId) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign({ userId }, secretKey, { expiresIn: '2h' });
  return token;
};

// Fungsi untuk memverifikasi JWT
const verifyToken = (token) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const decoded = jwt.verify(token, secretKey);
  return decoded;
};

// Fungsi untuk melakukan proses otentikasi
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send({ message: 'No token provided' });
    }
    const decodedToken = verifyToken(token);
    const userId = decodedToken.userId;
    const user = await models.users.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Invalid token' });
  }
};

export { generateToken, authenticateUser };
