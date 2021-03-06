const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.5'),
    });
    await waveContract.deployed();
    console.log(`Contract deployed to: ${waveContract.address}`);
    console.log(`Contract deployed by: ${owner.address}`);
    await waveContract.getTotalWaves();
    let waveTxn2 = await waveContract.connect(randomPerson).wave('Another message wow');
    await waveTxn2.wait();
    await waveContract.getTotalWaves();
    const waves = await waveContract.getAllWaves();
    console.log(waves);
    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    )
    console.log(
        'Contract balance:',
        hre.ethers.utils.formatEther(contractBalance)
    )
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();