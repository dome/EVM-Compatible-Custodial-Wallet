const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const Transaction = require("../models/Transactions");
const { ethers, Signer } = require("ethers");
require("dotenv").config()
const abi = require("../Utils/abi.json")
const rpc = require("../Utils/rpc.json")


router.get("/getaddress", async (req, res) => {
    const { query } = req
    try {
        const user = await Users.findOne({
            email: query.email,
            // email: req.body.email,
        });

        res.send(user.networks[query.network].accounts.map((e) => e.publicKey))

    } catch (err) {
        res.status(401).send("address not found")
    }
})

router.get("/getSentTransactions", async (req, res) => {
    try {
        const { query } = req

        const transaction = await Transaction.find({
            from: query.publicKey,
            network: query.network,
            type: "Sent"
        });
        // console.log("sentttt", query.publicKey, query.network)
        // console.log("sentttt", query.publicKey, query.network)

        res.send(transaction)
    } catch (err) {
        res.status(401).send("ERROR")
    }
})

router.get("/getReceivedTransactions", async (req, res) => {
    try {
        const { query } = req
        const transaction = await Transaction.find({

            to: query.publicKey,
            network: query.network,
            type: "Receive"
        });
        // console.log("recevierdd", query.publicKey, query.network)

        res.send(transaction)
    } catch (err) {
        res.status(401).send("ERROR")
    }
})

router.get("/getBalance", async (req, res) => {
    const { query } = req

    try {
        const provider = new ethers.providers.JsonRpcProvider(`${rpc[query.network]}`);

        const b = await provider.getBalance(
            // req.body.address
            query.address
        );
        // console.log(b)
        res.send(b)
    }
    catch (Err) {
        res.status(400).send("cant")
    }
})

router.get("/getTokenBalance", async (req, res) => {
    const { query } = req
    try {
        const provider = new ethers.providers.JsonRpcProvider(`${process.env.ALCHEMY_KEY_TESTNET}`);

        const contract = new ethers.Contract(
            //    req.body.contractAddress,
            query.contractAddress,
            abi,
            provider
        );
        // console.log(contract)
        const bal = await contract.balanceOf(query.address)
        res.send(bal)
    }
    catch (err) {
        res.send(err)
    }
})


module.exports = router;
