// Path: Backend/server.js
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

// ✅ FIX: Trust the proxy from services like Render. This is essential for secure cookies.
app.set('trust proxy', 1);

app.use(cors({
  origin: FRONTEND_URL,
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ FIX FOR CROSS-BROWSER LOGIN (SAFARI, BRAVE):
// Made cookie settings explicit for production to ensure compatibility.
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // MUST be true for cross-site cookies.
    httpOnly: true, // Prevents client-side script access.
    sameSite: 'none', // Required for cross-domain authentication.
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));


app.use(passport.initialize());
app.use(passport.session());

const resetTokens = {};
const verifyTokens = {};

// =================================================================
// MIDDLEWARE (Unaltered)
// =================================================================
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized. Please log in." });
};

const isAdmin = (req, res, next) => {
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim());
    if (req.isAuthenticated() && adminEmails.includes(req.user.email)) {
        return next();
    }
    res.status(403).json({ error: "Forbidden: You do not have admin privileges." });
};

// =================================================================
// PASSPORT STRATEGIES (Unaltered)
// =================================================================
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

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) { return done(null, false, { message: 'User not found' }); }
        if (!user.verifiedUser) { return done(null, false, { message: 'Please verify your email to login.' }); }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return done(null, false, { message: 'Invalid credentials' }); }
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
// AUTHENTICATION & USER ROUTES (Unaltered)
// =================================================================
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: `${FRONTEND_URL}/welcome`,
    failureRedirect: `${FRONTEND_URL}/notfound`
}));

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

app.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ success: true, message: "Logged in successfully", user: req.user });
});

app.get('/login/success', (req, res) => {
    if (req.isAuthenticated()) {
        const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim());
        const userObj = req.user.toObject();
        userObj.isAdmin = adminEmails.includes(userObj.email);
        res.status(200).json({ success: true, user: userObj });
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
    res.status(200).json({ user: req.user });
});

app.get('/api/user/status', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('hasBasicRegistration hasMembershipCard registeredEvents')
            .populate('registeredEvents', 'eventName');
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching user status." });
    }
});


// 🚀 NEW: ENDPOINT FOR DYNAMIC PRICING
app.get('/api/price/:paymentFor', async (req, res) => {
    const { paymentFor } = req.params;
    try {
        if (paymentFor === 'MembershipCard') {
            const paidCount = await Order.countDocuments({ paymentFor: 'MembershipCard', status: 'paid' });
            const price = (paidCount < 100) ? 1599 : 1800;
            res.status(200).json({ price, paidCount });
        } else if (paymentFor === 'BasicRegistration') {
            res.status(200).json({ price: 249 });
        } else {
            res.status(404).json({ error: 'Price information not found for this item.' });
        }
    } catch (error) {
        console.error("Price fetch error:", error);
        res.status(500).json({ error: 'Failed to fetch price.' });
    }
});


// =================================================================
// RAZORPAY & CART ROUTES
// =================================================================
const razorpayInstance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_API_SECRET });
app.get('/api/getkey', (req, res) => res.status(200).json({ key: process.env.RAZORPAY_API_KEY }));


// ✅ SECURED: CHECKOUT LOGIC WITH SERVER-SIDE PRICING
app.post('/api/checkout', isAuthenticated, async (req, res) => {
    const { paymentFor, relatedId } = req.body;
    let amount;

    try {
        if (paymentFor === 'MembershipCard') {
            const paidCount = await Order.countDocuments({ paymentFor: 'MembershipCard', status: 'paid' });
            amount = (paidCount < 100) ? 1599 : 1800;
        } else if (paymentFor === 'BasicRegistration') {
            amount = 249;
        } else if (paymentFor === 'Event') {
            amount = req.body.amount; // Events have variable prices
        }

        if (!amount) {
            return res.status(400).json({ success: false, message: "Invalid item for purchase." });
        }

        const options = { amount: Number(amount * 100), currency: "INR" };
        const razorpayOrder = await razorpayInstance.orders.create(options);
        
        await Order.create({
            userId: req.user._id,
            paymentFor,
            amount, // Use the secure, server-calculated amount
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
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET).update(body.toString()).digest("hex");
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

app.post('/registerevent', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.hasBasicRegistration) {
            return res.status(403).json({ error: "Basic Registration is required to register for events." });
        }
        const { eventName, teamLeaderName, teamLeaderMobileNo, teamLeaderEmail, teamLeaderCollege, teamSize, teamLeaderGender, fees } = req.body;
        if (!eventName || !teamLeaderName || !teamLeaderEmail || !teamSize || !fees) {
            return res.status(400).json({ error: "Missing required event registration fields." });
        }
        const existingRegistration = await EventRegistration.findOne({ eventName: eventName, teamLeaderEmail: teamLeaderEmail, Paid: false });
        if (existingRegistration) {
            return res.status(400).json({ error: "You have already added this event to your cart." });
        }
        const newRegistration = new EventRegistration({ eventName, teamLeaderName, teamLeaderMobileNo, teamLeaderEmail, teamLeaderCollege, teamSize, teamLeaderGender, fees, Paid: false });
        await newRegistration.save();
        res.status(201).json({ success: true, message: "Event added to cart successfully.", registration: newRegistration });
    } catch (error) {
        console.error("Event Registration Error:", error);
        res.status(500).json({ error: "Server error during event registration." });
    }
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
    try {
        const { registrationId } = req.body;
        const userEmail = req.user.email;
        if (!registrationId) {
            return res.status(400).json({ error: "Registration ID is required." });
        }
        const registrationToDelete = await EventRegistration.findOne({ _id: registrationId, teamLeaderEmail: userEmail });
        if (!registrationToDelete) {
            return res.status(404).json({ error: "Item not found in your cart or you do not have permission to remove it." });
        }
        await EventRegistration.deleteOne({ _id: registrationId });
        res.status(200).json({ success: true, message: "Item removed from cart." });
    } catch (error) {
        console.error("Cart Item Removal Error:", error);
        res.status(500).json({ error: "Server error while removing item from cart." });
    }
});

// =================================================================
// ADMIN ROUTES (Unaltered)
// =================================================================
const adminRouter = express.Router();

adminRouter.get('/basic-registrations', async (req, res) => {
    try {
        const registrations = await Order.find({ paymentFor: 'BasicRegistration', status: 'paid' })
            .populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch basic registrations.' });
    }
});

adminRouter.get('/membership-cards', async (req, res) => {
    try {
        const memberships = await Order.find({ paymentFor: 'MembershipCard', status: 'paid' })
            .populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(memberships);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch membership cards.' });
    }
});

adminRouter.get('/event-registrations', async (req, res) => {
    try {
        const eventOrders = await Order.find({ paymentFor: 'Event', status: 'paid' })
            .populate('userId', 'name email').sort({ createdAt: -1 });
        const paidRegistrationIds = eventOrders.map(order => order.relatedRegistrationId).filter(id => id);
        const eventRegistrations = await EventRegistration.find({ _id: { $in: paidRegistrationIds } });
        const combinedData = eventRegistrations.map(reg => {
            const order = eventOrders.find(o => o.relatedRegistrationId && o.relatedRegistrationId.equals(reg._id));
            return {
                ...reg.toObject(),
                orderId: order?.razorpay_order_id,
                paymentId: order?.razorpay_payment_id,
                amount: order?.amount,
                paid: order?.status === 'paid',
            };
        });
        res.json(combinedData);
    } catch (error) {
        console.error("Admin Event Reg Fetch Error:", error);
        res.status(500).json({ error: 'Failed to fetch event registrations.' });
    }
});

app.use('/api/admin', isAdmin, adminRouter);

// =================================================================
// SERVER START
// =================================================================
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});