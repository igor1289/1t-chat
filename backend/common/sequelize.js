import { Sequelize } from 'sequelize'

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_DIALECT } = process.env

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false
})

async function authenticate() {
  try {
    await sequelize.authenticate()
    console.log('Соединение с БД успешно выполнено')
  } catch (error) {
    console.log('Соединение с БД не выполнено. Процесс завершён')
    console.log(error)
    process.exit(1)
  }
}

authenticate()

export default sequelize
