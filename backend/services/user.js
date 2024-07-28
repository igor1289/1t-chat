import User from '../models/user.js'
import authenticationService from '../services/authentication.js'

async function findByName(name) {
  return await User.findOne({
    where: {
      name: name
    }
  })
}

async function findById(id) {
  return await User.findByPk(id)
}

async function create(data) {
  const newUser = User.build(data)
  await newUser.setPassword(data.password)
  await newUser.save()
  return newUser
}

async function login(name, password) {
  const user = await findByName(name, password)

  if (user) {
    if (await user.verifyPassword(password)) {
      return {
        id: user.id,
        name: user.name,
        accessToken: authenticationService.signUserAccessToken(user)
      }
    }
  }
}

async function register(data) {
  if (!(await findByName(data.name))) {
    return await create(data)
  }
}

export default {
  findById,
  findByName,
  register,
  login
}
