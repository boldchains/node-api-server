import appHttpServer from './server'

const port = process.env.PORT || 4001

appHttpServer.listen(port, () => {
  console.log(`Drone server is running on port ${port}`)
})
