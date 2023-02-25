import axios from "axios";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom/dist";
import { SERVER_URL } from "../../constants";
import useLocalStorage from "../../hook/useLocalStorage";

export default function HomePage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setUser] = useLocalStorage("user");

  const [to, setTo] = useState("");
  const [currentAccount, setCurrentAccount] = useState({ i: null, j: null });
  const [accounts, setAccounts] = useState([]);
  const [networks, setNetworks] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState("");
  const [detail, setDetails] = useState([]);
  const [receivedData, setReceivedData] = useState([]);
  const [ethBalance, setEthBalance] = useState("");
  //const [tokenBalance, setTokenBalance] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (state === null) {
      navigate("/login");
    }
  }, [state]);

  const currSymbol = {
    0: "ETH",
    1: "BNB",
    2: "MATIC",
    3: "AVAX",
    4: "VET",
    5: "DOGE",
    6: "ULX",
    7: "ETH",
    8: "ETC",
    9: "CRO",
    10: "gETH",
    11: "tBNB",
    12: "MATIC",
  };

  const createAccount = async (e) => {
    setLoading(true);
    e.preventDefault();
    const post = { email: state?.email, network: networks };

    try {
      const res = await axios.post(
        `${SERVER_URL}/api/user/createAccount`,
        post
      );

      if (res.status == 200) {
        // console.log(res.data);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);

      console.log("i failed", e);
    }

    getAccounts();
  };

  const transactionData = async (e) => {
    e.preventDefault();
    setLoading(true);
    let result;
    if (currentAccount.j == undefined) {
      setLoading(false);
      return alert("select account first");
    }
    const post = {
      email: state?.email,
      currency: currSymbol[networks],
      network: networks,
      currentNetwork,
      amount,
      to,
      accountNo: currentAccount.j,
    };
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/transactions/sendether`,
        post
      );
      result = res;
      if (result.status == 201) {
        alert(result.data);
      }
      setAmount("");
      setTo("");
      setLoading(false);
    } catch (e) {
      setLoading(false);

      alert(e.response.data);
    }

    sent();
    received();
  };

  //   const transactionData2 = async (e) => {
  //     e.preventDefault();
  //     setLoading(true);
  //     let result;
  //     if (currentAccount.j == undefined) {
  //       setLoading(false);
  //       return alert("select account first");
  //     }
  //     const post = {
  //       email: state.email,
  //       currency: currSymbol[networks],
  //       network: networks,
  //       currentNetwork,
  //       amount,
  //       to,
  //       accountNo: currentAccount.j,
  //       contractAddress:""
  //     };
  //     try {
  //       const res = await axios.post(
  //         `${SERVER_URL}/api/transactions/sendtokens`,
  //         post
  //       );
  //       result = res;
  //       if (result.status == 201) {
  //         alert(result.data);
  //       }
  //       setLoading(false);
  //     } catch (e) {
  //       setLoading(false);

  //       alert(e.response.data);
  //     }

  //     sent();
  //     received();
  //   };

  const sent = async () => {
    const transactionDetails = await axios.get(
      `${SERVER_URL}/api/getData/getSentTransactions`,
      {
        params: {
          publicKey: currentAccount.i,
          network: currentNetwork,
        },
      }
    );

    if (transactionDetails.status == 200) {
      setDetails(transactionDetails.data);
    }
  };

  useEffect(() => {
    sent();
    received();
  }, [currentAccount.i]);

  const received = async () => {
    const transactionDetails2 = await axios.get(
      `${SERVER_URL}/api/getData/getReceivedTransactions`,
      {
        params: {
          publicKey: currentAccount.i,
          network: currentNetwork,
        },
      }
    );
    if (transactionDetails2.status == 200) {
      setReceivedData(transactionDetails2.data);
    }
  };

  const getEthBalance = async () => {
    try {
      const ethBalance = await axios.get(
        `${SERVER_URL}/api/getData/getBalance`,
        {
          params: {
            address: currentAccount.i,
            network: networks,
          },
        }
      );
      if (ethBalance.status == 200) {
        setEthBalance(ethers.utils.formatEther(ethBalance.data.hex));
      }
    } catch (err) {
      // console.log("error")
    }
  };
  // console.log(networks)
  //   const getTokenBalance = async () => {
  //     try {
  //       const tokenBalance = await axios.get(
  //         `${SERVER_URL}/api/getData/getTokenBalance`,
  //         {
  //           params: {
  //             address: currentAccount.i,
  //             contractAddress: "0xdae8C5B28842d48dB23D6615abd63a6870Ef9A6a",
  //           },
  //         }
  //       );
  //       if (tokenBalance.status == 200) {
  //         // console.log(tokenBalance.data)
  //         setTokenBalance(ethers.utils.formatEther(tokenBalance.data.hex));
  //       }
  //     } catch (err) {
  //       // console.log(err)
  //     }
  //   };

  const getAccounts = async () => {
    const allAccounts = await axios.get(
      `${SERVER_URL}/api/getData/getaddress`,
      {
        params: {
          email: state?.email,
          network: networks,
        },
      }
    );

    if (allAccounts.status == 200) {
      setAccounts(allAccounts.data);
    }
  };

  const logout = () => {
    console.log("CALLED");
    setUser(null);

    // setLoading(false);
  };
  useEffect(() => {
    sent();
    received();
    getAccounts();
  }, [networks]);

  useEffect(() => {
    if (currentAccount.i) getEthBalance();
    //getTokenBalance();
  }, [currentAccount.i, networks]);

  return (
    <div className="text-center">
      {state &&
        state.Networks.map((e, key) => (
          <button
            onClick={() => {
              setNetworks(key);
              setCurrentNetwork(e.name);
              setCurrentAccount("");
              setEthBalance("");
            }}
            disabled={loading}
            style={{ margin: "5px" }}
          >
            {e.name}
          </button>
        ))}
      {currentNetwork !== "" && (
        <h3 style={{ marginTop: "50px" }}>{`Network : ${currentNetwork}`}</h3>
      )}
      <h1 className="main-title home-page-title">Welcome </h1>
      <p>{state?.name}</p>
      <p> {currentAccount?.i}</p>
      <p>
        {accounts &&
          accounts.map((i, j) => (
            <div style={{ display: "inline", margin: "3px" }}>
              <button
                onClick={() => setCurrentAccount({ i: i, j: j })}
                style={{ padding: "10px" }}
                disabled={loading}
              >
                Account {j + 1}{" "}
              </button>
            </div>
          ))}
      </p>
      {/* { */}
      {networks !== null ? (
        <>
          {ethBalance !== "" && (
            <p>Balance: {`${ethBalance} ${currSymbol[networks]}`}</p>
          )}
          <p>
            {" "}
            <form className="addAcc" onSubmit={createAccount}>
              {" "}
              <button
                type="submit"
                style={{ padding: "10px" }}
                disabled={loading}
              >
                Add Account
              </button>
            </form>
          </p>

          <h2>Send {currSymbol[networks]}</h2>
          <form onSubmit={transactionData}>
            <input
              type="text"
              placeholder="To"
              required
              style={{ marginBottom: "10px" }}
              value={to}
              onChange={(e) => setTo(e.target.value)}
            ></input>{" "}
            <br />
            <input
              type="text"
              placeholder="Amount"
              required
              style={{ marginBottom: "10px" }}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            ></input>
            <br />
            <button type="submit" disabled={loading}>
              Send {currSymbol[networks]}
            </button>
          </form>
          <br />
          {/* <h2>Send ERC20 tokens:</h2>
          <p>Balance: {`${tokenBalance} Tokens`}</p>
          <form onSubmit={transactionData2}>
            <input
              type="text"
              placeholder="To"
              required
              style={{ marginBottom: "10px" }}
              value={to2}
              onChange={(e) => setTo2(e.target.value)}
            ></input>{" "}
            <br />
            <input
              type="text"
              placeholder="Amount"
              required
              style={{ marginBottom: "10px" }}
              value={amount2}
              onChange={(e) => setAmount2(e.target.value)}
            ></input>
            <br />
            <button type="submit" disabled={loading}>
              Send Tokens
            </button>
          </form> */}
          <br />
          <div>
            <h1>Transactions History</h1>
            <h3 style={{ fontWeight: "bold" }}>Sent:</h3>
            {detail.map((key) => (
              <>
                <p>
                  To : {key.to}, Amount :{" "}
                  {`${ethers.utils.formatEther(key.amount).toString()} ${
                    currSymbol[networks]
                  }`}
                  , Status : {key.status ? "true" : "false"}
                </p>
              </>
            ))}

            <h3 style={{ fontWeight: "bold" }}>Received:</h3>
            {receivedData.map((key) => (
              <>
                <p>
                  From : {key.from}, Amount :{" "}
                  {`${ethers.utils.formatEther(key.amount).toString()} ${
                    currSymbol[networks]
                  }`}
                  , Status : {key.status ? "true" : "false"}
                </p>
              </>
            ))}
          </div>
        </>
      ) : (
        ""
      )}

      <button
        className="primary-button"
        style={{ marginBottom: "10px" }}
        onClick={logout}
        disabled={loading}
      >
        Log out
      </button>
    </div>
  );
}
