import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos!' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }
    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, password) => password.required()),
      confirmPassword: Yup.string().when(
        'password',
        (password, confirmPassword) =>
          confirmPassword.required().oneOf([Yup.ref('password')])
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos!' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // Se tiver alteração de email
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      // Verifica se outro usuário já não esta usando o e-mail
      if (userExists) {
        return res.status(400).json({
          error: 'Este e-mail já esta sendo utilizado por outro usuário',
        });
      }
    }

    // Se tiver alteração de senha
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
