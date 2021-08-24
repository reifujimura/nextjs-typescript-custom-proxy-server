import express from 'express'
import next from 'next'
import { createProxyMiddleware } from 'http-proxy-middleware'

const dev = process.env.NODE_ENV !== 'production'
const port = dev ? 3000 : 80
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use(
    '/api',
    createProxyMiddleware({
      target: process.env.PROXY_TARGET,
      changeOrigin: true,
      pathRewrite: { '^/api': '/' },
    })
  )
  server.all('*', (req, res) => handle(req, res))

  server.listen(port)
})
