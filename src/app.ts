import express from 'express'
import { Express, Request, Response } from 'express'
import config from 'config'
import cors from 'cors'
import log from './logger'
import connect from './db/connect'

import apiErrorHandler from './controllers/error.controller'

import userRouter from './routes/user.routes'
import memoryRouter from './routes/post.routes'

const PORT = (config.get('PORT') || 3001) as number

const app = express()

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false }))

app.use(cors())

app.listen(PORT, async () => {
  log.info(`Server is running at ${PORT}`)
  await connect()
})

app.get('/api', (req: Request, res: Response) =>
 res.send('Welcome to memories-app')
)
app.use('/api/users', userRouter)
app.use('/api/memories', memoryRouter)
app.use(apiErrorHandler)

export default app