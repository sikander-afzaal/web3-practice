import { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

const App = () => {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      // with metamask we have an access to window.ethereum & window.web3
      // metamask injects a global API into websites
      // this API allows websites to request users, accounts, read data to blockchain, sign messages and transactions
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider);

      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider: provider,
          contract,
        });
      } else {
        console.log("Please, install metamask");
      }
    };
    loadProvider();
  }, []);
  //getting the connected account using the provider above
  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    if (!web3Api.web3) return;
    getAccounts();
  }, [web3Api.web3]);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="is-flex is-flex-direction-column justify-center items-center">
            <strong>Account: </strong>

            {account ? (
              <h1>{account}</h1>
            ) : (
              <button
                onClick={() =>
                  web3Api.provider.request({ method: "eth_requestAccounts" })
                }
                className="button"
              >
                Connect Wallet
              </button>
            )}
          </div>
          <div className="balance-view is-size-2 mb-4">
            Current Balance: <strong>10</strong> ETH
          </div>
          <button className="button is-primary  mr-2">Donate</button>
          <button className="button is-link ">Whithraw</button>
        </div>
      </div>
    </>
  );
};

export default App;
