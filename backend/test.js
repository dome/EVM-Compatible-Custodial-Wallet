
// const { Keyring } = require('@polkadot/api');

// // Create a new keyring instance
// const keyring = new Keyring({ type: 'sr25519' });

// // Generate a new keypair
// const pair = keyring.addNewPair();

// // Get the public address from the keypair
// const address = pair.address;

// console.log(`Generated address: ${address}`);



//BCH
// const SimpleWallet = require("simple-bitcoin-wallet");

// const simpleWallet = new SimpleWallet();

// // 12 words seed phrase for the wallet
// console.log(simpleWallet.mnemonic);

// cash address derived from the seed (derivation path: m/44'/0'/0'/0/0)
// console.log(simpleWallet.cashAddress);

// // legacy address derived from the seed (derivation path: m/44'/0'/0'/0/0)
// console.log(simpleWallet.legacyAddress);

// // private key for the BCH address derived from the seed (derivation path: m/44'/0'/0'/0/0)
// console.log(simpleWallet.privateKey);
// // //BTC
// const bip39 = require('bip39')
// const bitcoin = require('bitcoinjs-lib')

// const ecc = require('tiny-secp256k1')
// const { BIP32Factory } = require('bip32')
// // You must wrap a tiny-secp256k1 compatible implementation
// const bip32 = BIP32Factory(ecc)
// //Define the network
// const network = bitcoin.networks.bitcoin //use networks.testnet for testnet

// // Derivation path
// const path = `m/49'/0'/0'/0` // Use m/49'/1'/0'/0 for testnet

// let mnemonic = "dsfsd nnnnnnnfgsdkugggggggsdjkgr37468754iu532@"

// const seed = bip39.mnemonicToSeedSync(mnemonic)
// let root = bip32.fromSeed(seed, network)

// let account = root.derivePath(path)
// let node = account.derive(0).derive(0)
// let BTCprivateKey = node.toWIF()

// let btcAddress = bitcoin.payments.p2pkh({
//     pubkey: node.publicKey,
//     network: network,
// }).address

// console.log(`

// Wallet generated:

//  - Address  : ${btcAddress},
//  - Key : ${BTCprivateKey},
//  - Mnemonic : ${mnemonic}

// `)


//multichain
// const multichainWallet = require('multichain-crypto-wallet');


// const wallet = multichainWallet.createWallet({
//     derivationPath: "m/44'/60'/0'/0/0", // Leave empty to use default derivation path
//     network: 'bitcoin',

// });

// console.log(wallet)
// const privateKeyToPublicKey = require("ethereum-private-key-to-public-key");
// const publicKeyToAddress = require("ethereum-public-key-to-address");
// const { createHash } = require("crypto");
// require("dotenv").config()
// const secret_key = createHash("sha256")
//     .update(process.env.SECRET_KEY)
//     .digest("hex");


// const uid = createHash("sha256").update("0").digest("hex");

// const pid = createHash("sha256").update(process.env.P_ID).digest("hex");

// const concate = secret_key + uid + pid;

// const privateKey = createHash("sha256").update(concate).digest("hex");

// const hash = privateKeyToPublicKey(Buffer.from(privateKey, 'hex')).toString('hex')
// const publicKey = publicKeyToAddress(Buffer.from(hash, 'hex'))


// console.log(publicKey)