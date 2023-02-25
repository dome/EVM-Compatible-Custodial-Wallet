const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Users = require("../models/Users");
const Transaction = require("../models/Transactions");
const ethers = require("ethers");
const abi = require("../Utils/abi.json");
const rpc = require("../Utils/rpc.json");
const bitcoin = require("bitcoinjs-lib");
const request = require("request");
const CryptoAccount = require("send-crypto");
require("dotenv").config();

router.post("/sendether", async (req, res) => {
  const temp = ethers.utils.parseEther(req.body.amount).toString();
  console.log(temp);
  const ownerPercentage = (temp / 100) * 20;
  console.log(ownerPercentage);

  const ownerCommission = ownerPercentage.toString();
  console.log(ownerCommission);
  const sendingAmount = (temp - ownerCommission).toString();
  const sendingNetwork = req.body.network;

  console.log(
    "you entered amount:",
    req.body.amount,
    "20% for owner is:",
    ownerPercentage,
    "owner commission in ether:",
    ownerCommission
  );
  console.log("receiver gets: ", sendingAmount);

  let ownerAccount = await Users.findOne({ type: "Admin" });
  let ownerAddress =
    ownerAccount?.networks[sendingNetwork]?.accounts[0].publicKey;
  console.log("im the ownerrrrrr", ownerAddress);
  let user;
  let sendingAccount;
  try {
    console.log("im hitting ether");

    user = await Users.findOne({
      email: req.body.email,
    });

    sendingAccount =
      user?.networks[sendingNetwork]?.accounts[req.body.accountNo].publicKey;

    const sendingAccountPrvtKey =
      user?.networks[sendingNetwork]?.accounts[req.body.accountNo].privateKey;

    console.log("im hitting ether2");
    if (sendingAccount !== req.body.to) {
      const hashPassword = CryptoJS.AES.decrypt(
        sendingAccountPrvtKey,
        process.env.PASS_SEC
      );

      const privateKey = hashPassword.toString(CryptoJS.enc.Utf8);

      console.log("im hitting ether3");
      const provider = new ethers.providers.JsonRpcProvider(
        rpc[req.body.network]
      );

      const sender = new ethers.Wallet(privateKey, provider);
      console.log(privateKey);
      console.log("Sending........");
      console.log("Sendong", sendingAmount);

      await sender.sendTransaction({
        to: req.body.to,
        value: sendingAmount, //in ETH
      });

      console.log("Sent done");
      const tx = new Transaction({
        from: sendingAccount,
        to: req.body.to,
        amount: sendingAmount,
        network: req.body.currentNetwork,
        currency: req.body.currency,
        status: true,
        type: "Sent",
      });
      const history = await tx.save();
      console.log("ONWR", ownerCommission);
      await sender.sendTransaction({
        to: ownerAddress,
        value: ownerCommission, //in ETH
      });

      reciever = await Users.findOne({
        publicKey: req.body.to,
      });

      if (reciever) {
        const tx2 = new Transaction({
          from: sendingAccount,
          to: req.body.to,
          amount: sendingAmount,
          network: req.body.currentNetwork,
          currency: req.body.currency,
          status: true,
          type: "Receive",
        });
        await tx2.save();
      }

      console.log("owner commission sent");
      res.status(201).send("Sent");
    } else {
      const tx = new Transaction({
        from: sendingAccount,
        to: req.body.to,
        amount: req.body.amount,
        network: req.body.currentNetwork,
        currency: req.body.currency,
        status: false,
        type: "Sent",
      });
      const history = await tx.save();
      console.log("Sending Failed");
      res.status(400).send("Transaction failed");
    }
  } catch (err) {
    const tx = new Transaction({
      from: sendingAccount,
      to: req.body.to,
      amount: req.body.amount,
      network: req.body.currentNetwork,
      currency: req.body.currency,
      status: false,
      type: "Sent",
    });
    console.log("Sending Failed");

    const history = await tx.save();
    res.status(400).send("Transaction failed");
  }
});

router.post("/sendtokens", async (req, res) => {
  const percentAmount = (req.body.amount / 100) * 2;
  const percentInEther = ethers.utils
    .parseEther(percentAmount.toString())
    .toString();
  const sendingAmount = (
    ethers.utils.parseEther(req.body.amount) - percentInEther
  ).toString();

  let ownerAccount = await Users.findOne({ type: "Admin" });
  let ownerAddress =
    ownerAccount.accounts[
      ownerAccount.accounts.length.toString() - 1
    ].publicKey.toString();

  let user;
  let usingAccount;
  try {
    console.log("sending tokens1");
    user = await Users.findOne({
      email: req.body.email,
    });

    usingAccount = user.accounts[req.body.accountNo].publicKey.toString();

    const usingAccountPrvtKey =
      user.accounts[req.body.accountNo].privateKey.toString();

    if (usingAccount !== req.body.to) {
      console.log("sending tokens2");
      const hashPassword = CryptoJS.AES.decrypt(
        usingAccountPrvtKey,
        process.env.PASS_SEC
      );
      const privateKey = hashPassword.toString(CryptoJS.enc.Utf8);
      console.log("sending tokens3");

      const provider = new ethers.providers.JsonRpcProvider(
        `${process.env.ALCHEMY_KEY_TESTNET}`
      );

      console.log("sending tokens4");

      const signer = new ethers.Wallet(privateKey, provider);
      const contract = new ethers.Contract(
        req.body.contractAddress,
        abi,
        signer
      );
      console.log("Sending........");

      await contract.transfer(req.body.to, sendingAmount);

      console.log("Sent done");

      await contract.transfer(ownerAddress, percentInEther);

      console.log("commission sent");

      const tx = new Transaction({
        from: usingAccount,
        to: req.body.to,
        amount: sendingAmount,
        chainId: req.body.chainId,
        token: "ERC20",
        status: true,
        type: "sent",
      });
      const history = await tx.save();

      reciever = await Users.findOne({
        publicKey: req.body.to,
      });
      if (reciever) {
        const tx2 = new Transaction({
          from: usingAccount,
          to: req.body.to,
          amount: sendingAmount,
          chainId: req.body.chainId,
          token: "ERC20",
          status: true,
          type: "receive",
        });
        await tx2.save();
      }

      res.status(201).send("Sent");
    } else {
      const tx = new Transaction({
        from: usingAccount,
        to: req.body.to,
        amount: ethers.utils.parseEther(req.body.amount),
        chainId: req.body.chainId,
        token: "ERC20",
        status: false,
        type: "sent",
      });
      const history = await tx.save();
      res.status(400).send("Transaction failed");
    }
  } catch (err) {
    console.log("naahhh failded here bros");

    const tx = new Transaction({
      from: usingAccount,
      to: req.body.to,
      amount: ethers.utils.parseEther(req.body.amount),
      chainId: req.body.chainId,
      token: "ERC20",
      status: false,
      type: "sent",
    });
    const history = await tx.save();
    res.status(400).send("Transaction failed");
  }
});

module.exports = router;
