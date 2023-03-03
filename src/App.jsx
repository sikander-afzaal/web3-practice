import { useCallback, useEffect, useState } from "react";
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
  const [balance, setBalance] = useState(0);
  const [reload, setReload] = useState(false);

  const reloadEffect = useCallback(() => setReload((prev) => !prev), [reload]);
  const setAccountListener = (provider) => {
    provider.on("accountsChanged", () => window.location.reload());

    // provider._jsonRpcConnection.events.on("notification", (payload) => {
    //   const { method } = payload;
    //   if (method === "metamask_unlockStateChanged") {
    //     setAccount(null);
    //   }
    // });
  };
  //loading the provider and getting the contract
  useEffect(() => {
    const loadProvider = async () => {
      // with metamask we have an access to window.ethereum & window.web3
      // metamask injects a global API into websites
      // this API allows websites to request users, accounts, read data to blockchain, sign messages and transactions
      const provider = await detectEthereumProvider();
      if (!provider) return alert("please install metamask");
      if (provider) {
        const contract = await loadContract("Faucet", provider);
        setAccountListener(provider);
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
  }, [web3Api.web3, reload]);
  //getting the balance
  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      //converting wei to ether
      setBalance(web3.utils.fromWei(balance, "ether"));
    };
    web3Api.contract && loadBalance();
  }, [web3Api, reload]);

  //add funds function
  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    const res = await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });
    reloadEffect();
  }, [web3Api, account, reloadEffect]);
  const withrawFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmount = web3.utils.toWei("0.1", "ether");
    const res = await contract.withdraw(withdrawAmount, {
      from: account,
    });
    reloadEffect();
  }, [web3Api, account, reloadEffect]);
  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="is-flex is-flex-direction-column justify-center items-center">
            <strong>Account: </strong>

            {account ? (
              <h1>{account}</h1>
            ) : web3Api.provider ? (
              <button
                onClick={() =>
                  web3Api.provider.request({ method: "eth_requestAccounts" })
                }
                className="button"
              >
                Connect Wallet
              </button>
            ) : (
              <h2>Please Install Metamask</h2>
            )}
          </div>
          <div className="balance-view is-size-2 mb-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          {account && (
            <>
              <button onClick={addFunds} className="button is-primary  mr-2">
                Donate 1 ETH
              </button>
              <button onClick={withrawFunds} className="button is-link ">
                Whithraw 0.1 ETH
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
