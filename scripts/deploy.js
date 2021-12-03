const deploy = async () => {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with the account:", deployer.address);

    const DsPunks = await ethers.getContractFactory("DsPunks");
    const deployed = await DsPunks.deploy(1000);

    console.log("Ds Punks is deployed at:", deployed.address);
};

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });