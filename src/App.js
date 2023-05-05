// import logo from './logo.svg';
import Web3 from 'web3';
import './App.css';
import { useState } from 'react';
// import CreatePost from './containers/CreatePost';
import { Box } from '@mui/material';
import styled from '@emotion/styled';
import Abi from './Abi';
// import Test from './containers/Test';
import Comp from './containers/Comp';


 function App() {
  const [isConnected, setIsConnected] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null)

  const BoxComp = styled(Box)`  `
  const buttonConnectCss = {
    backgroundColor: 'grey',
  }

  const buttonConnectedCss = {
    backgroundColor: 'green',

  }

  const handleConnect = async () => {
    const contractAddress = "0x7e5c35e45fdF926Db8aF725748f484Ce0b865C45";
    const contractABI = Abi.abi ;
    
    
    try {
      await window.ethereum.enable();
      setIsConnected(true);
      const accounts = await web3.eth.getAccounts();
      setAddress(accounts[0]);
      setProvider(web3.currentProvider);
      const contractA = new web3.eth.Contract(contractABI, contractAddress);
      setContract(contractA);
    } catch (error) {
      console.error('Failed to connect to MetaMask:', error);
    }
  };

  return (
    <div className="App">
      <BoxComp>
       {isConnected ? (
        <>
        <button  style={buttonConnectedCss}>Connected</button>
        {/* <CreatePost provider={provider} accountsAddress={address} web3={web3} contract={contract}/> */}
        <Comp  contract={contract} accountsAddress={address} />  
        </>
      ) : (
        <button style={buttonConnectCss} onClick={handleConnect}>Connect to MetaMask</button>
      )}
      </BoxComp>
    </div>
  );
}

export default App;
