require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const express = require("express");
const Razorpay = require("razorpay");
const mongoose = require('mongoose');

// =================================================================
// DATABASE & MODELS
// =================================================================
require("./db/conn");
const User = require("./model/userSchema");
const EventRegistration = require("./model/registrationSchema");
const Order = require("./model/orderSchema");
const sendEmail = require("./utils/sendEmail");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

// =================================================================
// INITIAL SETUP & CONFIG
// =================================================================
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;
const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT || 6005;

const app = express();

app.use(cors({
  origin: FRONTEND_URL,
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(passport.initialize());
app.use(passport.session());

// In-memory stores for tokens (can be moved to a DB like Redis for production)
const resetTokens = {};
const verifyTokens = {};

// =================================================================
// MIDDLEWARE
// =================================================================

// Checks if a user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized. Please log in." });
};

// Checks if the authenticated user is an admin
const isAdmin = (req, res, next) => {
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',');
    if (req.isAuthenticated() && adminEmails.includes(req.user.email)) {
        return next();
    }
    res.status(403).json({ error: "Forbidden: You do not have admin privileges." });
};


// =================================================================
// PASSPORT STRATEGIES (Authentication Logic)
// =================================================================

// Google OAuth2 Strategy: For Google Sign-in
passport.use(new OAuth2Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${BACKEND_URL}/auth/google/callback`,
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.email });
        if (user) {
            if (!user.verifiedUser) { user.verifiedUser = true; await user.save(); }
            return done(null, user);
        }
        const newUser = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            name: profile.displayName,
            email: profile.email,
            image: profile.photos[0].value,
            verifiedUser: true,
        });
        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        return done(error, null);
    }
}));

// Local Strategy: For manual email/password login
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        if (!user.verifiedUser) {
            return done(null, false, { message: 'Please verify your email to login.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Invalid credentials' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


// =================================================================
// AUTHENTICATION & USER ROUTES
// =================================================================

// --- Google Auth Routes ---
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: `${FRONTEND_URL}/welcome`,
    failureRedirect: `${FRONTEND_URL}/notfound`
}));

// --- Manual Registration and Verification ---
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, verifiedUser: false });
        await newUser.save();
        const verifyToken = crypto.randomBytes(32).toString('hex');
        verifyTokens[email] = { token: verifyToken, expiry: Date.now() + 15 * 60 * 1000 };
        const verifyUrl = `${BASE_URL}/emailverification?token=${verifyToken}&email=${encodeURIComponent(email)}`;
        const message = `Please click the link to verify your email: <a href="${verifyUrl}">${verifyUrl}</a>`;
        await sendEmail("Verification Email", message, email, process.env.EMAIL_USER, email);
        res.status(200).json({ success: true, message: "User registered. Please verify your email." });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Server error during registration." });
    }
});

app.post('/emailverification', async (req, res) => {
    const { email, token } = req.body;
    if (!email || !token) return res.status(400).json({ error: "All fields are required" });
    const storedToken = verifyTokens[email];
    if (!storedToken || storedToken.token !== token || storedToken.expiry < Date.now()) {
        if (storedToken && storedToken.expiry < Date.now()) delete verifyTokens[email];
        return res.status(400).json({ error: "Invalid or expired token" });
    }
    await User.updateOne({ email }, { verifiedUser: true });
    delete verifyTokens[email];
    res.status(200).json({ message: "Email verified successfully" });
});

// --- Manual Login and Password Reset ---
app.post('/login', passport.authenticate('local'), (req, res) => {
    // If authentication is successful, Passport adds the user to the request object.
    res.status(200).json({ success: true, message: "Logged in successfully", user: req.user });
});

app.post('/forgotpassword', async (req, res) => {
    // This logic can be expanded. For now, it's as it was.
});

app.post('/resetpassword', async (req, res) => {
    // This logic can be expanded. For now, it's as it was.
});


// --- User State and Logout ---
app.get('/login/success', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ success: true, user: req.user });
    } else {
        res.status(401).json({ success: false });
    }
});

app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy((err) => {
            if (err) return next(err);
            res.clearCookie('connect.sid', { path: '/' });
            res.status(200).json({ success: true, message: "User Logged out successfully." });
        });
    });
});

app.get('/user', isAuthenticated, (req, res) => {
    // req.user is populated by Passport's deserializeUser
    res.status(200).json({ user: req.user });
});

app.get('/api/user/status', isAuthenticated, async (req, res) => {
    try {
        // We re-fetch from DB to ensure the data is the absolute latest
        const user = await User.findById(req.user.id).select('hasBasicRegistration hasMembershipCard');
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching user status." });
    }
});


// =================================================================
// RAZORPAY PAYMENT GATEWAY
// =================================================================

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

app.get('/api/getkey', (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
});

// This route MUST be authenticated
app.post('/api/checkout', isAuthenticated, async (req, res) => {
    const { amount, paymentFor, relatedId } = req.body;

    const options = {
        amount: Number(amount * 100),
        currency: "INR",
    };

    try {
        const razorpayOrder = await razorpayInstance.orders.create(options);
        await Order.create({
            userId: req.user._id,
            paymentFor,
            amount,
            razorpay_order_id: razorpayOrder.id,
            relatedRegistrationId: relatedId,
        });
        res.status(200).json({ success: true, order: razorpayOrder });
    } catch (error) {
        console.error("Checkout Error:", error);
        res.status(500).json({ success: false, message: "Could not create Razorpay order." });
    }
});

app.post('/api/paymentverification', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        const order = await Order.findOne({ razorpay_order_id });
        if (!order) return res.status(400).redirect(`${FRONTEND_URL}/paymentfailure`);

        order.razorpay_payment_id = razorpay_payment_id;
        order.razorpay_signature = razorpay_signature;
        order.status = 'paid';
        await order.save();

        if (order.paymentFor === 'BasicRegistration') {
            await User.updateOne({ _id: order.userId }, { hasBasicRegistration: true });
        } else if (order.paymentFor === 'MembershipCard') {
            await User.updateOne({ _id: order.userId }, { hasMembershipCard: true });
        } else if (order.paymentFor === 'Event' && order.relatedRegistrationId) {
            await EventRegistration.updateOne({ _id: order.relatedRegistrationId }, { Paid: true });
            await User.updateOne({ _id: order.userId }, { $addToSet: { registeredEvents: order.relatedRegistrationId } });
        }

        res.redirect(`${FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`);
    } else {
        await Order.updateOne({ razorpay_order_id }, { status: 'failed' });
        res.redirect(`${FRONTEND_URL}/paymentfailure`);
    }
});


// =================================================================
// EVENT & CART ROUTES
// =================================================================
app.post('/registerevent', isAuthenticated, async (req, res) => {
    // Your existing event registration logic goes here
    // Remember to associate the registration with req.user._id
});
app.get('/cart', isAuthenticated, async (req, res) => {
    const userEmail = req.query.email;
    if (req.user.email !== userEmail) {
        return res.status(403).json({ error: "Forbidden" });
    }
    const cartItems = await EventRegistration.find({ teamLeaderEmail: userEmail, Paid: false });
    res.status(200).json(cartItems);
});
app.post('/cart/remove', isAuthenticated, async (req, res) => {
    // Your existing cart removal logic here
});

// =================================================================
// ADMIN ROUTES
// =================================================================

const adminRouter = express.Router();

adminRouter.get('/basic-registrations', async (req, res) => {
    try {
        const registrations = await Order.find({ paymentFor: 'BasicRegistration', status: 'paid' })
            .populate('userId', 'name email');
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch basic registrations.' });
    }
});

adminRouter.get('/membership-cards', async (req, res) => {
    try {
        const memberships = await Order.find({ paymentFor: 'MembershipCard', status: 'paid' })
            .populate('userId', 'name email');
        res.json(memberships);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch membership cards.' });
    }
});

adminRouter.get('/event-registrations', async (req, res) => {
    try {
        const { eventName } = req.query;
        let filter = { Paid: true };
        if (eventName) {
            filter.eventName = { $regex: eventName, $options: 'i' };
        }
        const events = await EventRegistration.find(filter)
            .populate('userId', 'name email');
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch event registrations.' });
    }
});

// All routes under /api/admin/* will first pass through isAdmin middleware
app.use('/api/admin', isAdmin, adminRouter);


// =================================================================
// SERVER START
// =================================================================
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});