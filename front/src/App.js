import { useEffect, useState, useCallback } from 'react'
import { ethers } from 'ethers'
import abi from './utils/WavePortal.json'

import Table from './components/Table'
import Form from './components/Form'
import { getAccountsByMethod } from './utils/walletUtils'

function App() {
  const [currentAccount, setCurrentAccount] = useState()
  const [isMining, setIsMining] = useState(false)
  const [isRinkeby, setIsRinkeby] = useState(false)
  const [ethereum, setEthereum] = useState(false)
  const [wavesNumber, setWavesNumber] = useState()
  const [waves, setWaves] = useState([])
  const [isWavesLoading, setIsWavesLoading] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
  const contractABI = abi.abi

  const getProvider = useCallback(() => {
    return new ethers.providers.Web3Provider(ethereum)
  }, [ethereum])

  const getNetwork = useCallback(async () => {
    const network = await getProvider().getNetwork()
    if (network.name === 'rinkeby') setIsRinkeby(true)
  }, [getProvider])

  const getSigner = useCallback(() => {
    return getProvider().getSigner()
  }, [getProvider])

  const getContract = useCallback(() => {
    const signer = getSigner()
    return new ethers.Contract(contractAddress, contractABI, signer)
  }, [contractABI, getSigner])

  const getFormattedWaves = (waves) => waves
    .map(wave => ({ message: wave.message, waver: wave.waver, timestamp: new Date(wave.timestamp * 1000).toLocaleString() }))

  const checkIfEthereumExists = () => {
    const { ethereum } = window
    if (!ethereum) {
      return
    }
    setEthereum(ethereum)
  }

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      const accounts = await getAccountsByMethod(ethereum, 'eth_accounts')
      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0])
      }
    } catch (e) {
      console.log(e)
    }
  }, [ethereum])

  const connectWallet = async () => {
    try {
      const accounts = await getAccountsByMethod(ethereum, 'eth_requestAccounts')
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  const getAllWaves = useCallback(async () => {
    setIsWavesLoading(true)
    try {
      const wavePortalContract = getContract()
      const waves = await wavePortalContract.getAllWaves()
      setWaves(getFormattedWaves(waves))
    } catch (e) {
      console.log(e)
    }
    setIsWavesLoading(false)
  }, [getContract])

  const getWavesNumber = useCallback(async () => {
    try {
      const wavePortalContract = getContract()
      const count = await wavePortalContract.getTotalWaves()
      setWavesNumber(count.toNumber())
    } catch (e) {
      console.log(e)
    }
  }, [getContract])

  const sendWave = async () => {
    try {
      setIsMining(true)
      const wavePortalContract = getContract()
      let count = await wavePortalContract.getTotalWaves()
      const waveTxn = await wavePortalContract.wave(inputValue)
      await waveTxn.wait()
      count = await wavePortalContract.getTotalWaves()
      setWavesNumber(count.toNumber())
      setIsMining(false)
      setInputValue('')
    } catch (e) {
      setIsMining(false)
      console.log(e)
    }
  }

  const onNewWave = (from, timestamp, message) => {
    setWaves(prevState => [
      ...prevState,
      {
        waver: from,
        timestamp: new Date(timestamp * 1000).toLocaleString(),
        message
      }
    ])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await sendWave()
  }

  useEffect(() => {
    let wavePortalContract = null
    checkIfEthereumExists()
    if (!!ethereum) {
      checkIfWalletIsConnected()
      if (currentAccount) {
        getNetwork()
        if (isRinkeby) {
          getWavesNumber()
          getAllWaves()
          wavePortalContract = getContract()
          wavePortalContract.on('NewWave', onNewWave)
        }
      }
    }

    return () => {
      if (wavePortalContract) wavePortalContract.off('NewWave', onNewWave)
    }
  }, [getWavesNumber, currentAccount, getAllWaves, checkIfWalletIsConnected, getContract, getNetwork, isRinkeby, ethereum])

  return (
    <div className="dark:bg-gray-800 h-screen w-screen">
      <div className="container flex flex-col items-center">
        <h1 className="text-3xl text-white font-bold mt-5">👋🏻 Hey there !</h1>
        <p className="text-l text-gray-500 mt-5">Connect your Ethereum Wallet and wave at me !</p>
        { !ethereum && <p className="text-l text-red-500 mt-5">You have to install a wallet on your browser !</p> }
        { !currentAccount && <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-5" onClick={connectWallet}>Connect wallet</button> }
        { !isRinkeby && currentAccount && <p className="text-l text-red-500 mt-5">This app is using Rinkeby and you should set it on your wallet !</p> }
        { isRinkeby && !!ethereum && currentAccount &&
          <Form
            handleSubmit={handleSubmit}
            isMining={isMining}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        }
        { !isNaN(wavesNumber) && <p className="text-l text-gray-300 mt-2">{wavesNumber} people waved at me 😎</p> }

        { !isWavesLoading && <Table waves={waves}/> }
      </div>
    </div>
  )
}

export default App
