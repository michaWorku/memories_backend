import mongoose from 'mongoose'
import config from 'config'
import log from '../logger'

const connect = async () => {
  const LOCAL_DB_URI = config.get('LOCAL_DB_URI') as string
  //const DB_URI = config.get('DB_URI') as string
  //const uri = "mongodb+srv://mikias:wDxrASpyDJ7D1nOs@cluster0.3zosa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  return mongoose
    .connect(LOCAL_DB_URI)
    .then(() => log.info('Database connected'))
    .catch((error) => {
      log.error('Database error', error)
      console.log(error)
      process.exit(1)
    })
}

export default connect
