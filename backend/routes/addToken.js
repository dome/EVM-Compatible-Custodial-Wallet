// const router = require("express").Router();
// const Tokens = require("../models/Tokens");
// const abi = require("../Utils/abi.json")



// router.post("/addTokens", async (req, res) => {

//     try {
//         const provider = new ethers.providers.JsonRpcProvider(`${process.env.ALCHEMY_KEY_TESTNET}`);
//         const contract = new ethers.Contract(
//            req.body.contractAddress,
//             // query.contractAddress,
//             abi,
//             provider
//         );
//         // const bal = await contract.balanceOf("0xD6874c28Af6398236dF7F5df09C2b735Fa74A112")
//         // const bal = await contract.balanceOf(req.body.address)
//         res.send(contract)
//     }
//     catch (err) {
//         res.send("err")
//     }
// })




// module.exports = router;