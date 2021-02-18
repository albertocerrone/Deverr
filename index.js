import express from 'express'
import { port } from './config/environment.js'
import logger from './lib/logger.js'
import connectToDatabase from './lib/connectToDB.js'
import router from './config/router.js'
import errorHandler from './lib/errorHandler.js'
import path from 'path'

const app = express()

const __dirname = path.resolve()

async function startServer() {
  try {
    await connectToDatabase()
    console.log('Database has connected')

    app.use(express.static(`${__dirname}/client/build`))

    //*Makes req.body available 
    app.use(express.json())

    //*Logger logs each request to the console
    app.use(logger)

    //*Routes all routes
    app.use('/api', router)

    app.use('/*', (_, res) => res.sendFile(`${__dirname}/client/build/index.html`))

    //*Handles errors
    app.use(errorHandler)

    app.listen(port, () => console.log(`🤖 Up and running on port ${port}`))

  } catch (err) {
    console.log('🤖 Something went wrong starting the App')
    console.log(err)
  }
}

startServer()
