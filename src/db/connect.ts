import mongoose from 'mongoose'
import config from 'config'
import log from '../logger'

const connect = async () => {
  const DB_URI = config.get('DB_URI') as string
  const LOCAL_URI = 'mongodb://localhost:27017/memorieslocal'
  return mongoose
    .connect(LOCAL_URI)
    .then(() => log.info('Database connected'))
    .catch((error) => {
      log.error('Database error', error)
      console.log(error)
      process.exit(1)
    })
}

export default connect
