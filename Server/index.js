const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const teamRoutes = require('./routes/teamRoutes');
const productRoutes = require('./routes/productRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const accountDetailsRoute = require("./routes/accountDetailsRoutes");
const withdrawRoute = require("./routes/WithdrawRoutes");

const rechargeRoutes = require('./routes/rechargeRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');

const incomeRoutes = require('./routes/incomeRoutes');
const investRoutes = require('./routes/investRoutes');

const checkinRoutes = require('./routes/checkinRoutes');
const adminRoutes = require('./routes/AdminRoutes');




dotenv.config();
connectDB();

const app = express();

// Allow only localhost:3000 and Vercel frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://investmentpro.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server or curl
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,   // 🔑 allow cookies/headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/products', productRoutes);
app.use('/api', purchaseRoutes);
app.use("/api/account", accountDetailsRoute);
app.use("/api/withdraw", withdrawRoute);
app.use('/api/recharge', rechargeRoutes);
app.use('/api/user', userProfileRoutes);

app.use('/api/income', incomeRoutes);
app.use('/api/invest', investRoutes);

app.use('/api/checkin', checkinRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
