const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const helmet = require('helmet')
const path = require('path')

const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require('./routes/userRoutes')
const errorHandler = require('./middleware/errorMiddleware')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Insurance backend API is running.',
    data: null,
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/user', userRoutes)

app.use(errorHandler)

async function startServer(){
  try {
    await connectDB()
    app.listen(PORT)
  } catch (error) {
    console.error('Failed to start backend server:', error)
    process.exit(1)
  }
}

startServer()

