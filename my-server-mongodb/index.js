const express = require('express');
const app = express();
const port = 3002;

const morgan = require("morgan");
app.use(morgan("combined"));

const path = require("path");
const fs = require('fs');
app.use(express.static(path.join(__dirname, "public")));

const cors = require("cors");
//app.use(cors())
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



app.get("/", (req, res) => {
    res.send("This Web server is processed for MongoDB");
});

const { MongoClient, ObjectId } = require('mongodb');
const { log } = require('console');

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017", { serverSelectionTimeoutMS: 5000 });


const database = client.db(process.env.MONGODB_DB || "Fashiondata");
const fashionCollection = database.collection("Fashion");
const { initializeFashionIds, nextFashionId } = require('./fashion-identity');

app.get('/fashions/by-idf/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'IdF phải là số nguyên dương.' });
    }
    const fashion = await fashionCollection.findOne({ IdF: id });
    if (!fashion) return res.status(404).json({ message: 'Không tìm thấy Fashion.' });
    res.json(fashion);
});

app.get("/fashions", cors(), async (req, res) => {
    const result = await fashionCollection.find({}).toArray();
    res.send(result);
});

app.get("/fashions/:id", cors(), async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Invalid fashion ID" });
    var o_id = new ObjectId(req.params["id"]);
    const result = await fashionCollection.find({ _id: o_id }).toArray();
    if (!result[0]) return res.status(404).json({ message: "Fashion not found" });
    res.send(result[0]);
});

app.post("/fashions", cors(), async (req, res) => {
    if (!req.body || typeof req.body.fashion_subject !== 'string' || !req.body.fashion_subject.trim()) {
        return res.status(400).json({ message: 'Vui lòng nhập tên Fashion.' });
    }
    // IdF is assigned by the server; a client cannot override either identity.
    const { _id, IdF, ...fields } = req.body;
    const fashion = { ...fields, IdF: await nextFashionId(database) };
    await fashionCollection.insertOne(fashion);

    //send message to client(send all database to client)
    res.status(201).send(fashion);
});

app.put("/fashions", cors(), async (req, res) => {
    if (!ObjectId.isValid(req.body?._id)) return res.status(400).json({ message: "Invalid fashion ID" });
    await fashionCollection.updateOne(
        { _id: new ObjectId(req.body._id) }, //condition for update
        {
            $set: { //Field for updating
                style: req.body.style,
                fashion_subject: req.body.fashion_subject,
                fashion_detail: req.body.fashion_detail,
                fashion_image: req.body.fashion_image
            }
        }
    );

    //send Fashion after updating
    var o_id = new ObjectId(req.body._id);
    const result = await fashionCollection.find({ _id: o_id }).toArray();
    if (!result[0]) return res.status(404).json({ message: "Fashion not found" });
    res.send(result[0]);
});

app.delete("/fashions/:id", cors(), async (req, res) => {
    //find detail Fashion with id
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Invalid fashion ID" });
    var o_id = new ObjectId(req.params["id"]);
    const result = await fashionCollection.find({ _id: o_id }).toArray();

    //update json Fashion into database
    await fashionCollection.deleteOne(
        { _id: o_id }
    );

    //send Fashion after remove
    if (!result[0]) return res.status(404).json({ message: "Fashion not found" });
    res.send(result[0]);
});

app.post('/user-login', async (req, res) => {
    const UserCollection = database.collection("User");

    const user = await UserCollection.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        if (req.body.rememberMe) {
            res.cookie('remember_user', req.body.username, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
                httpOnly: false,
                secure: false, // Set true nếu chạy https
                sameSite: 'Lax'
            });
        }

        res.status(200).send({
            message: "Login successful!",
            user: { username: user.username, role: user.role }
        });

    } else {
        res.status(401).send({ message: "Wrong user or email!" });
    }
});
app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(error.status || 500).json({ message: error.status === 400 ? 'Invalid request body' : 'Database request failed' });
});

client.connect().then(() => initializeFashionIds(database)).then(() => app.listen(port, () => {
    console.log(`My Server listening on port ${port}`);
})).catch(error => { console.error("MongoDB connection failed:", error.message); process.exitCode = 1; });
