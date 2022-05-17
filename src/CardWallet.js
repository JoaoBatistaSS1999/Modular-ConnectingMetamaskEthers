import React, { useState } from "react";
import classes from "./CardWallet.module.css";
import { ethers } from "ethers";

function CardWallet() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connected, setConnected] = useState(false);

  const connectWalletHandler = () => {
    // checking if metamask exists
    if (window.ethereum) {
      // requesting accounts
      window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
        accountChangeHandler(res[0]);
      });
    } else {
      setErrorMessage("Install Metamask!");
    }
  };

  const accountChangeHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getUserBalance(newAccount.toString());
  };

  const getUserBalance = (address) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [address, "latest"] })
      .then((res) => {
        const balance = parseFloat(ethers.utils.formatEther(res));
        setUserBalance(balance.toFixed(2));
      });
    setConnected(true);
  };

  const chainChangeHandler = () => {
    setConnected(false);
    window.location.reload();
  };

  // listener to changes in accounts
  window.ethereum.on("accountsChanged", accountChangeHandler);

  // listener to changes on the chain (refreshes the page)
  window.ethereum.on("chainChanged", chainChangeHandler);

  return (
    <div className={classes.walletCard}>
      <h4>Connecting to metamaskt using ethers.js</h4>
      <button onClick={connectWalletHandler}>Connet Wallet</button>
      {connected && (
        <React.Fragment>
          <div>
            <h3>Address: {defaultAccount}</h3>
          </div>
          <div>
            <h3>Balance: {userBalance} Ether</h3>
          </div>
        </React.Fragment>
      )}
      {errorMessage}
    </div>
  );
}

export default CardWallet;
