import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";

const PORT = Number(process.env.PORT || 8000);
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const MONGODB_NAME = process.env.MONGODB_NAME || "taylorni_db";
const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "2h";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

const nowIso = () => new Date().toISOString();

const client = new MongoClient(MONGODB_URI);
let db;

const collections = () => ({
  users: db.collection("users"),
  chatSessions: db.collection("chat_sessions"),
  messages: db.collection("messages"),
  rewards: db.collection("rewards"),
  loyaltyPoints: db.collection("loyalty_points"),
  pointsTransactions: db.collection("points_transactions"),
  referrals: db.collection("referrals"),
  paymentIntents: db.collection("payment_intents"),
  paymentMethods: db.collection("payment_methods"),
  wallets: db.collection("wallets"),
  transactions: db.collection("transactions"),
  escrows: db.collection("escrows"),
});

const isObjectIdLike = (value) => typeof value === "string" && ObjectId.isValid(value);

const issueAccessToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      userType: user.userType || "client",
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );

const issueRefreshToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      type: "refresh",
    },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

const toSafeUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  firstName: user.firstName || "",
  lastName: user.lastName || "",
  userType: user.userType || "client",
  shopName: user.shopName || "",
});

const ensureUser = async (userIdentifier) => {
  const { users } = collections();

  if (!userIdentifier) {
    let anonymous = await users.findOne({ externalId: "anonymous" });
    if (!anonymous) {
      const insert = await users.insertOne({
        externalId: "anonymous",
        email: "anonymous@example.com",
        firstName: "Guest",
        lastName: "",
        userType: "client",
        createdAt: nowIso(),
        updatedAt: nowIso(),
      });
      anonymous = await users.findOne({ _id: insert.insertedId });
    }
    return anonymous;
  }

  if (isObjectIdLike(userIdentifier)) {
    const byObjectId = await users.findOne({ _id: new ObjectId(userIdentifier) });
    if (byObjectId) {
      return byObjectId;
    }
  }

  const byExternal = await users.findOne({ externalId: String(userIdentifier) });
  if (byExternal) {
    return byExternal;
  }

  const insert = await users.insertOne({
    externalId: String(userIdentifier),
    email: `user_${String(userIdentifier)}@example.com`,
    firstName: "User",
    lastName: String(userIdentifier),
    userType: "client",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });
  return users.findOne({ _id: insert.insertedId });
};

const ensureWallet = async (userId) => {
  const { wallets } = collections();
  let wallet = await wallets.findOne({ userId });
  if (!wallet) {
    const insert = await wallets.insertOne({
      userId,
      available: 0,
      pending: 0,
      currency: "USD",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    wallet = await wallets.findOne({ _id: insert.insertedId });
  }
  return wallet;
};

const ensureLoyaltyPoints = async (userId) => {
  const { loyaltyPoints } = collections();
  let points = await loyaltyPoints.findOne({ userId });
  if (!points) {
    const insert = await loyaltyPoints.insertOne({
      userId,
      total: 0,
      available: 0,
      pending: 0,
      lifetime: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    points = await loyaltyPoints.findOne({ _id: insert.insertedId });
  }
  return points;
};

const ensureDefaultRewards = async () => {
  const { rewards } = collections();
  const count = await rewards.countDocuments();
  if (count > 0) return;

  await rewards.insertMany([
    {
      title: "$5 Off Next Order",
      description: "Get $5 off your next order",
      pointsCost: 100,
      type: "discount",
      value: "$5",
      createdAt: nowIso(),
    },
    {
      title: "Free Shipping",
      description: "Redeem for free shipping",
      pointsCost: 150,
      type: "freebie",
      value: "Free Shipping",
      createdAt: nowIso(),
    },
  ]);
};

app.get("/api/health", async (_req, res) => {
  const ping = await db.command({ ping: 1 });
  res.json({ status: "ok", db: ping.ok === 1 ? "connected" : "unknown" });
});

app.post("/api/auth/register", async (req, res) => {
  const { users } = collections();
  const {
    email,
    password,
    firstName = "",
    lastName = "",
    userType = "client",
    shopName = "",
  } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
  }

  const existing = await users.findOne({ email: String(email).toLowerCase() });
  if (existing) {
    return res.status(400).json({ error: "user exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const insert = await users.insertOne({
    email: String(email).toLowerCase(),
    passwordHash,
    firstName,
    lastName,
    userType,
    shopName: userType === "designer" ? shopName : "",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });
  const user = await users.findOne({ _id: insert.insertedId });

  return res.status(201).json({
    access: issueAccessToken(user),
    refresh: issueRefreshToken(user),
    userType: user.userType,
    userId: user._id.toString(),
    user: toSafeUser(user),
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { users } = collections();
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
  }

  const user = await users.findOne({ email: String(email).toLowerCase() });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: "invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "invalid credentials" });
  }

  return res.json({
    access: issueAccessToken(user),
    refresh: issueRefreshToken(user),
    userType: user.userType,
    userId: user._id.toString(),
    user: toSafeUser(user),
  });
});

app.post("/api/auth/refresh", async (req, res) => {
  const { refresh } = req.body || {};
  if (!refresh) {
    return res.status(400).json({ error: "refresh token required" });
  }

  try {
    const payload = jwt.verify(refresh, JWT_SECRET);
    if (payload.type !== "refresh") {
      return res.status(401).json({ error: "invalid token type" });
    }

    const { users } = collections();
    const user = await users.findOne({ _id: new ObjectId(payload.sub) });
    if (!user) {
      return res.status(401).json({ error: "user not found" });
    }

    return res.json({ access: issueAccessToken(user) });
  } catch {
    return res.status(401).json({ error: "invalid refresh token" });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  const { chatSessions, messages } = collections();
  const sessionId = req.body?.sessionId || `session_${Date.now()}`;
  const messageText = req.body?.message || "";
  const user = await ensureUser(req.body?.userId);

  const existing = await chatSessions.findOne({ sessionId });
  if (!existing) {
    await chatSessions.insertOne({
      sessionId,
      userId: user._id.toString(),
      status: "active",
      startedAt: nowIso(),
      updatedAt: nowIso(),
    });
  } else {
    await chatSessions.updateOne(
      { _id: existing._id },
      { $set: { status: "active", updatedAt: nowIso() } }
    );
  }

  await messages.insertOne({
    sessionId,
    type: "user",
    content: messageText,
    metadata: { intent: req.body?.intent || "general_inquiry" },
    timestamp: nowIso(),
  });

  const responsePayload = {
    messageId: `bot_${Date.now()}`,
    response:
      "Thanks for your message! I can help with orders, designers, and style advice.",
    intent: req.body?.intent || "general_inquiry",
    confidence: 0.9,
    suggestions: ["Track my order", "Find a designer", "Get style advice"],
  };

  await messages.insertOne({
    sessionId,
    type: "bot",
    content: responsePayload.response,
    metadata: {
      intent: responsePayload.intent,
      confidence: responsePayload.confidence,
      suggestions: responsePayload.suggestions,
    },
    timestamp: nowIso(),
  });

  res.json(responsePayload);
});

app.get("/api/ai/quick-actions", (_req, res) => {
  res.json({
    actions: ["Track my order", "Find a designer", "Get style advice", "Contact support"],
  });
});

app.post("/api/ai/sessions/:session_id/end", async (req, res) => {
  const { chatSessions } = collections();
  await chatSessions.updateOne(
    { sessionId: req.params.session_id },
    { $set: { status: "resolved", updatedAt: nowIso() } }
  );
  res.json({ status: "ended" });
});

app.get("/api/rewards/points/:user_id", async (req, res) => {
  const user = await ensureUser(req.params.user_id);
  const points = await ensureLoyaltyPoints(user._id.toString());
  res.json(points);
});

app.get("/api/rewards/available/:user_id", async (_req, res) => {
  const { rewards } = collections();
  await ensureDefaultRewards();
  const items = await rewards.find({}).toArray();
  res.json(items);
});

app.post("/api/rewards/redeem", async (req, res) => {
  const { rewardId, userId } = req.body || {};
  if (!rewardId || !userId) {
    return res.status(400).json({ error: "rewardId and userId are required" });
  }

  const user = await ensureUser(userId);
  const points = await ensureLoyaltyPoints(user._id.toString());
  const { rewards, loyaltyPoints, pointsTransactions } = collections();
  const reward = await rewards.findOne({
    _id: isObjectIdLike(rewardId) ? new ObjectId(rewardId) : rewardId,
  });

  if (!reward) {
    return res.status(404).json({ error: "reward not found" });
  }
  if ((points.available || 0) < (reward.pointsCost || 0)) {
    return res.status(400).json({ error: "insufficient points" });
  }

  await loyaltyPoints.updateOne(
    { _id: points._id },
    {
      $inc: {
        available: -(reward.pointsCost || 0),
        total: -(reward.pointsCost || 0),
      },
      $set: { updatedAt: nowIso() },
    }
  );
  await pointsTransactions.insertOne({
    userId: user._id.toString(),
    type: "redeemed",
    points: -(reward.pointsCost || 0),
    description: `Redeemed: ${reward.title}`,
    relatedOrderId: "",
    timestamp: nowIso(),
  });

  return res.json({ status: "redeemed", reward });
});

app.get("/api/rewards/transactions/:user_id", async (req, res) => {
  const user = await ensureUser(req.params.user_id);
  const { pointsTransactions } = collections();
  const tx = await pointsTransactions
    .find({ userId: user._id.toString() })
    .sort({ timestamp: -1 })
    .toArray();
  res.json(tx);
});

app.post("/api/rewards/award", async (req, res) => {
  const { userId, points = 0, action = "action" } = req.body || {};
  const user = await ensureUser(userId);
  const doc = await ensureLoyaltyPoints(user._id.toString());
  const awardPoints = Number(points) || 0;

  const { loyaltyPoints, pointsTransactions } = collections();
  await loyaltyPoints.updateOne(
    { _id: doc._id },
    {
      $inc: {
        total: awardPoints,
        available: awardPoints,
        lifetime: awardPoints,
      },
      $set: { updatedAt: nowIso() },
    }
  );
  await pointsTransactions.insertOne({
    userId: user._id.toString(),
    type: "earned",
    points: awardPoints,
    description: `Awarded points for ${action}`,
    relatedOrderId: "",
    timestamp: nowIso(),
  });

  res.json({ pointsAwarded: awardPoints });
});

app.get("/api/rewards/referrals/:user_id", async (req, res) => {
  const user = await ensureUser(req.params.user_id);
  const { referrals } = collections();
  let referral = await referrals.findOne({ userId: user._id.toString() });
  if (!referral) {
    const insert = await referrals.insertOne({
      userId: user._id.toString(),
      code: `REF${user._id.toString().slice(-6).toUpperCase()}`,
      referrals: 0,
      successfulReferrals: 0,
      totalEarned: 0,
      pendingRewards: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    referral = await referrals.findOne({ _id: insert.insertedId });
  }
  res.json(referral);
});

app.post("/api/rewards/referrals/generate", async (req, res) => {
  const user = await ensureUser(req.body?.userId);
  const { referrals } = collections();
  let referral = await referrals.findOne({ userId: user._id.toString() });
  if (!referral) {
    const insert = await referrals.insertOne({
      userId: user._id.toString(),
      code: `REF${user._id.toString().slice(-6).toUpperCase()}`,
      referrals: 0,
      successfulReferrals: 0,
      totalEarned: 0,
      pendingRewards: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    referral = await referrals.findOne({ _id: insert.insertedId });
  }
  res.json({ code: referral.code });
});

app.post("/api/rewards/referrals/apply", (_req, res) => {
  res.json({ status: "applied" });
});

app.post("/api/payments/intents", async (req, res) => {
  const { paymentIntents } = collections();
  const intent = {
    orderId: req.body?.orderId || "0",
    userId: req.body?.userId || null,
    amount: Number(req.body?.amount || 0),
    currency: req.body?.currency || "USD",
    status: "pending",
    clientSecret: `pi_${Date.now()}`,
    createdAt: nowIso(),
  };
  const insert = await paymentIntents.insertOne(intent);
  res.status(201).json({ id: insert.insertedId.toString(), ...intent });
});

app.post("/api/payments/card/process", async (req, res) => {
  const user = await ensureUser(req.body?.userId);
  const { transactions } = collections();
  const reference = `CARD_${Date.now()}`;

  await transactions.insertOne({
    userId: user._id.toString(),
    type: "debit",
    amount: Number(req.body?.amount || 0),
    currency: req.body?.currency || "USD",
    status: "completed",
    description: "Card payment",
    orderId: req.body?.orderId || null,
    paymentMethodId: req.body?.paymentMethodId || null,
    reference,
    timestamp: nowIso(),
  });

  res.json({ success: true, reference });
});

app.post("/api/payments/mobile-money/process", async (req, res) => {
  const user = await ensureUser(req.body?.userId);
  const { transactions } = collections();
  const reference = `MM_REF_${Date.now()}`;

  await transactions.insertOne({
    userId: user._id.toString(),
    type: "debit",
    amount: Number(req.body?.amount || 0),
    currency: req.body?.currency || "USD",
    status: "pending",
    description: "Mobile money payment",
    orderId: req.body?.orderId || null,
    paymentMethodId: null,
    reference,
    timestamp: nowIso(),
  });

  res.json({ reference, authorization_url: "" });
});

app.get("/api/payments/mobile-money/verify/:reference", async (req, res) => {
  const { transactions } = collections();
  const tx = await transactions.findOne({ reference: req.params.reference });
  if (!tx) {
    return res.status(404).json({ error: "reference not found" });
  }

  if (tx.status === "pending") {
    await transactions.updateOne(
      { _id: tx._id },
      { $set: { status: "completed", updatedAt: nowIso() } }
    );
    tx.status = "completed";
  }

  res.json({
    id: tx._id.toString(),
    type: tx.type,
    amount: tx.amount,
    currency: tx.currency,
    status: tx.status,
    description: tx.description,
    reference: tx.reference,
  });
});

app.get("/api/wallet/:user_id/balance", async (req, res) => {
  const user = await ensureUser(req.params.user_id);
  const wallet = await ensureWallet(user._id.toString());
  res.json(wallet);
});

app.post("/api/payments/wallet/process", async (req, res) => {
  const user = await ensureUser(req.body?.userId);
  const wallet = await ensureWallet(user._id.toString());
  const amount = Number(req.body?.amount || 0);
  const { wallets, transactions } = collections();

  if ((wallet.available || 0) < amount) {
    return res.status(400).json({ success: false, error: "insufficient wallet balance" });
  }

  await wallets.updateOne(
    { _id: wallet._id },
    { $inc: { available: -amount }, $set: { updatedAt: nowIso() } }
  );

  const reference = `WALLET_${Date.now()}`;
  await transactions.insertOne({
    userId: user._id.toString(),
    type: "debit",
    amount,
    currency: req.body?.currency || "USD",
    status: "completed",
    description: "Wallet payment",
    orderId: req.body?.orderId || null,
    paymentMethodId: null,
    reference,
    timestamp: nowIso(),
  });

  res.json({ success: true, reference });
});

app.post("/api/wallet/:user_id/add-funds", async (req, res) => {
  const user = await ensureUser(req.params.user_id);
  const wallet = await ensureWallet(user._id.toString());
  const amount = Number(req.body?.amount || 0);
  const { wallets, transactions } = collections();

  await wallets.updateOne(
    { _id: wallet._id },
    { $inc: { available: amount }, $set: { updatedAt: nowIso() } }
  );
  await transactions.insertOne({
    userId: user._id.toString(),
    type: "credit",
    amount,
    currency: req.body?.currency || "USD",
    status: "completed",
    description: "Wallet add funds",
    orderId: null,
    paymentMethodId: null,
    reference: `ADD_${Date.now()}`,
    timestamp: nowIso(),
  });

  res.json({ status: "added" });
});

app.post("/api/wallet/:user_id/withdraw", async (req, res) => {
  const user = await ensureUser(req.params.user_id);
  const wallet = await ensureWallet(user._id.toString());
  const amount = Number(req.body?.amount || 0);
  const { wallets, transactions } = collections();

  if ((wallet.available || 0) < amount) {
    return res.status(400).json({ status: "failed", error: "insufficient wallet balance" });
  }

  await wallets.updateOne(
    { _id: wallet._id },
    { $inc: { available: -amount }, $set: { updatedAt: nowIso() } }
  );
  await transactions.insertOne({
    userId: user._id.toString(),
    type: "debit",
    amount,
    currency: req.body?.currency || "USD",
    status: "completed",
    description: "Wallet withdrawal",
    orderId: null,
    paymentMethodId: null,
    reference: `WITHDRAW_${Date.now()}`,
    timestamp: nowIso(),
  });

  res.json({ status: "withdrawn" });
});

app.post("/api/payments/escrow/create", async (req, res) => {
  const { escrows } = collections();
  const escrow = {
    orderId: req.body?.orderId || null,
    amount: Number(req.body?.amount || 0),
    status: "held",
    releaseConditions: req.body?.releaseConditions || [],
    heldUntil: req.body?.heldUntil || null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  const insert = await escrows.insertOne(escrow);
  res.status(201).json({ id: insert.insertedId.toString(), ...escrow });
});

app.post("/api/payments/escrow/:escrow_id/release", async (req, res) => {
  const { escrows } = collections();
  const escrowId = req.params.escrow_id;
  const filter = isObjectIdLike(escrowId)
    ? { _id: new ObjectId(escrowId) }
    : { id: escrowId };
  const result = await escrows.updateOne(
    filter,
    { $set: { status: "released", updatedAt: nowIso() } }
  );
  if (result.matchedCount === 0) {
    return res.status(404).json({ error: "escrow not found" });
  }
  res.json({ status: "released" });
});

app.get("/api/payments/transactions/:user_id", async (req, res) => {
  const user = await ensureUser(req.params.user_id);
  const { transactions } = collections();
  const limit = Math.max(1, Math.min(100, Number(req.query.limit || 50)));
  const items = await transactions
    .find({ userId: user._id.toString() })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
  res.json(items);
});

app.get("/api/payments/methods/:user_id", async (req, res) => {
  const user = await ensureUser(req.params.user_id);
  const { paymentMethods } = collections();
  const methods = await paymentMethods.find({ userId: user._id.toString() }).toArray();
  res.json(methods);
});

app.post("/api/payments/methods/:user_id", async (req, res) => {
  const user = await ensureUser(req.params.user_id);
  const { paymentMethods } = collections();
  const doc = {
    userId: user._id.toString(),
    type: req.body?.type || "card",
    name: req.body?.name || "Card",
    details: req.body?.details || "",
    isDefault: Boolean(req.body?.isDefault),
    provider: req.body?.provider || "",
    lastFour: req.body?.lastFour || "",
    expiryDate: req.body?.expiryDate || "",
    logo: req.body?.logo || "",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  if (doc.isDefault) {
    await paymentMethods.updateMany(
      { userId: user._id.toString() },
      { $set: { isDefault: false, updatedAt: nowIso() } }
    );
  }

  const insert = await paymentMethods.insertOne(doc);
  res.status(201).json({ id: insert.insertedId.toString(), ...doc });
});

app.delete("/api/payments/methods/:user_id/:method_id", async (req, res) => {
  const user = await ensureUser(req.params.user_id);
  const { paymentMethods } = collections();
  const methodId = req.params.method_id;
  const filter = {
    userId: user._id.toString(),
    ...(isObjectIdLike(methodId)
      ? { _id: new ObjectId(methodId) }
      : { id: methodId }),
  };

  await paymentMethods.deleteOne(filter);
  res.status(204).send();
});

app.put("/api/payments/methods/:user_id/:method_id/default", async (req, res) => {
  const user = await ensureUser(req.params.user_id);
  const { paymentMethods } = collections();
  const methodId = req.params.method_id;

  await paymentMethods.updateMany(
    { userId: user._id.toString() },
    { $set: { isDefault: false, updatedAt: nowIso() } }
  );
  const filter = {
    userId: user._id.toString(),
    ...(isObjectIdLike(methodId)
      ? { _id: new ObjectId(methodId) }
      : { id: methodId }),
  };
  await paymentMethods.updateOne(
    filter,
    { $set: { isDefault: true, updatedAt: nowIso() } }
  );

  res.json({ status: "ok" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "internal_server_error" });
});

const start = async () => {
  try {
    await client.connect();
    db = client.db(MONGODB_NAME);

    const { users, chatSessions, paymentMethods, transactions } = collections();
    await users.createIndex({ email: 1 }, { unique: true, sparse: true });
    await users.createIndex({ externalId: 1 }, { unique: true, sparse: true });
    await chatSessions.createIndex({ sessionId: 1 }, { unique: true });
    await paymentMethods.createIndex({ userId: 1 });
    await transactions.createIndex({ userId: 1, timestamp: -1 });

    app.listen(PORT, () => {
      console.log(`Taylorni Node backend running on http://localhost:${PORT}`);
      console.log(`MongoDB connected: ${MONGODB_URI}/${MONGODB_NAME}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
};

start();
