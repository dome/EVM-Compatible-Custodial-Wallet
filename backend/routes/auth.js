const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const privateKeyToPublicKey = require("ethereum-private-key-to-public-key");
const publicKeyToAddress = require("ethereum-public-key-to-address");
const { createHash } = require("crypto");

router.post("/register", async (req, res) => {
  let type = "User";

  const _count = await Users.count({});
  console.log(_count)
  if (_count == 0) {
    type = "Admin";
  }

  const newUser = new Users({
    name: req.body.name,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    type: type,
  });
  console.log("yeraa", newUser);
  try {
    const savedUser = await newUser.save();
    console.log("type", savedUser);

    //ETHEREUM ADDRESSS
    const secret_key = createHash("sha256")
      .update(process.env.SECRET_KEY)
      .digest("hex");
    const uid = createHash("sha256")
      .update(savedUser._id.toString())
      .digest("hex");
    const pid = createHash("sha256").update(process.env.P_ID).digest("hex");
    const concate = secret_key + uid + pid;
    const privateKey = createHash("sha256").update(concate).digest("hex");

    const hash = privateKeyToPublicKey(Buffer.from(privateKey, "hex")).toString(
      "hex"
    );
    const publicKey = publicKeyToAddress(Buffer.from(hash, "hex"));

    const updateUser = await Users.findByIdAndUpdate(
      newUser._id,
      {
        networks: [
          {
            name: "Ethereum",
            accounts: {
              privateKey: CryptoJS.AES.encrypt(
                privateKey,
                process.env.PASS_SEC
              ).toString(),
              publicKey: publicKey,
            },
          },
          {
            name: "Binance",
            accounts: {
              privateKey: CryptoJS.AES.encrypt(
                privateKey,
                process.env.PASS_SEC
              ).toString(),
              publicKey: publicKey,
            },
          },
          {
            name: "Polygon",
            accounts: {
              privateKey: CryptoJS.AES.encrypt(
                privateKey,
                process.env.PASS_SEC
              ).toString(),
              publicKey: publicKey,
            },
          },
          {
            name: "Avalanche",
            accounts: {
              privateKey: CryptoJS.AES.encrypt(
                privateKey,
                process.env.PASS_SEC
              ).toString(),
              publicKey: publicKey,
            },
          },
          {
            name: "VeChain",
            accounts: {
              privateKey: CryptoJS.AES.encrypt(
                privateKey,
                process.env.PASS_SEC
              ).toString(),
              publicKey: publicKey,
            },
          },
          {
            name: "DOGE",
            accounts: {
              privateKey: CryptoJS.AES.encrypt(
                privateKey,
                process.env.PASS_SEC
              ).toString(),
              publicKey: publicKey,
            },
          },
          {
            name: "Tron",
            accounts: {
              privateKey: CryptoJS.AES.encrypt(
                privateKey,
                process.env.PASS_SEC
              ).toString(),
              publicKey: publicKey,
            },
          },
          {
            name: "Arbitrum",
            accounts: {
              privateKey: CryptoJS.AES.encrypt(
                privateKey,
                process.env.PASS_SEC
              ).toString(),
              publicKey: publicKey,
            },
          },
          {
            name: "Ethereum Classic",
            accounts: {
              privateKey: CryptoJS.AES.encrypt(
                privateKey,
                process.env.PASS_SEC
              ).toString(),
              publicKey: publicKey,
            },
          },
          {
            name: "Cronos",
            accounts: {
              privateKey: CryptoJS.AES.encrypt(
                privateKey,
                process.env.PASS_SEC
              ).toString(),
              publicKey: publicKey,
            },
          },
          {
            name: "Goerli",
            accounts: {
              privateKey: CryptoJS.AES.encrypt(
                privateKey,
                process.env.PASS_SEC
              ).toString(),
              publicKey: publicKey,
            },
          },
          {
            name: "BSC Testnet",
            accounts: {
              privateKey: CryptoJS.AES.encrypt(
                privateKey,
                process.env.PASS_SEC
              ).toString(),
              publicKey: publicKey,
            },
          },
          {
            name: "Mumbai",
            accounts: {
              privateKey: CryptoJS.AES.encrypt(
                privateKey,
                process.env.PASS_SEC
              ).toString(),
              publicKey: publicKey,
            },
          },
        ],
      },
      {
        new: true,
      }
    );

    res.status(201).json(updateUser);
  } catch (err) {
    console.log(err);
    res.status(500).send("USER ALREADY EXISTS");
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(401).json("Invaild email or password");
    }

    const hashPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const decryptedPassword = hashPassword.toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== req.body.password) {
      return res.status(401).json("Invaild email or password");
    }

    const { networks, ...others } = user._doc;

    let Networks = [];

    for (let i = 0; i < networks.length; i++) {
      let accounts = [];
      for (let j = 0; j < networks[i].accounts.length; j++) {
        accounts.push({ publicKey: networks[i].accounts[j].publicKey });
      }
      Networks.push({
        name: networks[i].name,
        accounts: accounts,
        tokens: networks[i].tokens,
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    res.status(200).json({ ...others, accessToken, Networks });
  } catch (err) {
    res.status(400).json(err);
  }
});

//ACCOUNT
router.post("/createAccount", async (req, res) => {
  try {
    const savedUser = await Users.findOne({
      email: req.body.email,
    });

    let publicKey;
    let privateKey;

    const secret_key = createHash("sha256")
      .update(process.env.SECRET_KEY)
      .digest("hex");
    const uid = createHash("sha256")
      .update(
        (savedUser?.networks[req.body.network]?.accounts[savedUser?.networks[req.body.network]?.accounts?.length - 1]._id).toString()
      )
      .digest("hex");
    const pid = createHash("sha256").update(process.env.P_ID).digest("hex");
    const concate = secret_key + uid + pid;

    const temp = createHash("sha256").update(concate).digest("hex");
    const hash = privateKeyToPublicKey(Buffer.from(temp, "hex")).toString(
      "hex"
    );
    publicKey = publicKeyToAddress(Buffer.from(hash, "hex"));
    privateKey = CryptoJS.AES.encrypt(temp, process.env.PASS_SEC).toString();

    const data = { publicKey, privateKey };
    const accounts = [...savedUser.networks[req.body.network].accounts, data];
    savedUser.networks[req.body.network].accounts = accounts;
    await savedUser.save();
    res.status(200).send("Account added");
  } catch (err) {
    res.status(500).send("Account creation failed");
  }
});

module.exports = router;
