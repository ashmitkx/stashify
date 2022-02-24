import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';

// routes
import { authRouter } from './routes/auth.route.js';

// middlewares
import { errorHandler } from './middlewares/errors.middleware.js';
import { protect } from './middlewares/protect.middleware.js';

// env vars
const PORT = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_BASE_URL;
const mongoUrl = process.env.MONGO_URL;
const session_secret = process.env.SESSION_STORE_SECRET;
const cookie_secret = process.env.COOKIE_SIGN_SECRET;
const maxAge = process.env.COOKIE_MAXAGE; // in seconds
const isProdEnv = process.env.NODE_ENV === 'production';

// connect to mongo
const mongoConnOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const mongoConnection = mongoose
    .connect(mongoUrl, mongoConnOptions)
    .then(con => con.connection.getClient());

const app = express();

// cors setup
const corsOptions = {
    origin: clientUrl,
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

// session storage
const sessionStore = new MongoStore({
    client: mongoConnection,
    collectionName: 'sessions',
    ttl: maxAge,
    crypto: { secret: session_secret }
});
const sessionOptions = {
    secret: cookie_secret,
    rolling: true,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    name: 'stashify.sid',
    cookie: {
        httpOnly: true,
        maxAge: maxAge * 1000,
        sameSite: 'lax',
        secure: isProdEnv // use secure cookies in production environment
    }
};
app.use(session(sessionOptions));

// authentication routes
app.use('/api/v1/auth', authRouter);
app.get('/a', protect, (req, res) => res.json(req.session));

// error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
