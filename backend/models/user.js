import { Model, DataTypes } from 'sequelize'
import sequelize from '../common/sequelize.js'
import { hash, compare } from 'bcrypt'

class User extends Model {
  async setPassword(password) {
    try {
      this.password = await hash(password, parseInt(process.env.SALT_ROUNDS))
      console.log(this.password)
    } catch (error) {
      console.log(error)
    }
  }

  async verifyPassword(password) {
    try {
      return compare(password, this.password)
    } catch (error) {
      console.log(error)
    }
  }

  getPayload() {
    return {
      id: this.id,
      name: this.name
    }
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: false
    }
  },
  {
    sequelize
  }
)

export default User
