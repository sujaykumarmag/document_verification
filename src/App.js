// Imports regarding router
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';



import { ethers } from "ethers"

import DocumentAbi from "./frontend/contractsData/Documents.json"
import DocumentAddress from "./frontend/contractsData/Documents-address.json"

// Import Files for Frontend
import Navigation from "./frontend/components/Navbar";



function App() {
  const [ loading, setLoading ] = useState(true)
  const [ account, setAccount ] = useState(null)
  const [ voter, setVoter ] = useState({});
  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[ 0 ])
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[ 0 ])
      await web3Handler()
    })
    loadContracts(signer)
  }
  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const Document = new ethers.Contract(DocumentAddress.address, DocumentAbi.abi, signer);
    setVoter(Document)
    setLoading(false)
  }

  return (
    <BrowserRouter>
      <div>
        <Navigation web3Handler={web3Handler} account={account} />
      </div>
      {/* <Routes>
        <Route path='/' element />
        <Route path="/senddoc" element/>
        <Route path="/verifydoc" element/>
        <Route path="/getdoc" element />
      </Routes> */}
    </BrowserRouter>

  );
}

export default App;
