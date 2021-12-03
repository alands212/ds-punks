const { expect } = require("chai");

describe('DS Punks Contract', () => {

    const setup = async ({ maxSupply = 10000 }) => {
        const [owner] = await ethers.getSigners();
        const DsPunks = await ethers.getContractFactory("DsPunks");
        const deployed = await DsPunks.deploy(maxSupply);

        return {
            owner,
            deployed,
        };
    };

    describe('Deployment', () => {
        it('Set max supply to passed param', async () => {
            const maxSupply = 4000;

            const { deployed } = await setup({ maxSupply });

            const returnedMaxSupply = await deployed.maxSupply();

            expect(maxSupply).to.equal(returnedMaxSupply)
        });
    });

    describe('Minting', () => {
        it('Mints a new token and assigns it to owner', async () => {
            const { owner, deployed } = await setup({});

            await deployed.mint();

            const ownerOfMinted = await deployed.ownerOf(0);

            expect(ownerOfMinted).to.equal(owner.address);
        });

        it('Has a minting limit', async () => {
            const maxSupply = 2;

            const { deployed } = await setup({ maxSupply });

            await Promise.all([
                deployed.mint(),
                deployed.mint()
            ]);

            await expect(deployed.mint()).to.be.revertedWith('No DsPunks left');

        });
    });

    describe('tokeUri', () => {
        it('returns valid metadata', async () => {
            const { deployed } = await setup({});

            await deployed.mint();

            const tonkenUri = await deployed.tokenURI(0);
            const stringFideTokenUri = await tonkenUri.toString();
            const [prefix, base64JSON] = stringFideTokenUri.split(
                "data:application/json;base64,"
            );
            const stringFideMetadata = await Buffer.from(base64JSON, "base64").toString("ascii");

            const metadata = JSON.parse(stringFideMetadata);

            expect(metadata).to.have.all.keys("name", "description", "image");
        });
    });
});