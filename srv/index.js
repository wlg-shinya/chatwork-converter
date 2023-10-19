import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'

export default (app, http) => {
  app.use(bodyParser.json())
  app.use(cors())
  app.listen(process.env.PORT || 3000)
}
