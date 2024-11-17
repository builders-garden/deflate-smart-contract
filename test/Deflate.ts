import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();
    console.log("owner", owner.address);

    const DeflatePortal = await hre.ethers.getContractFactory("DeflatePortal");
    const deflatePortal = await DeflatePortal.deploy(
      "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "0xb0324286B3ef7dDdC93Fb2fF7c8B7B8a3524803c",
      ["0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", "0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB", "0xBdb9300b7CDE636d9cD4AFF00f6F009fFBBc8EE6", "0x99CBC45ea5bb7eF3a5BC08FB1B7E56bB2442Ef0D"],
      owner.address,
      owner.address
    );

    return { deflatePortal, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { deflatePortal } = await loadFixture(deployOneYearLockFixture);

      expect(await deflatePortal.routerAddress()).to.equal("0xb0324286B3ef7dDdC93Fb2fF7c8B7B8a3524803c");
    });

  });

  describe("Check Data", function () {
    describe("Validations", function () {
      it("Check the Portal Data", async function () {
        const { deflatePortal } = await loadFixture(deployOneYearLockFixture);
        const dataValidation = await deflatePortal.validatePortalCalldata(
"0xa2e42c650000000000000000000000000000000000000000000000000000000000000040000000000000000000000000129b480ad625bcd1a5c3a1c10d708114726fa467000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda0291300000000000000000000000000000000000000000000000000000000002625a000000000000000000000000099cbc45ea5bb7ef3a5bc08fb1b7e56bb2442ef0d0000000000000000000000000000000000000000000000000002607aac52b5160000000000000000000000006d113e55a391e6ba1de2b41dacfbfa9a2afa7e5f00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000005400000000000000000000000000000000000000000000000000000000000000640000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda02913000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda029130000000000000000000000000000000000000000000000000000000000000080ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000129b480ad625bcd1a5c3a1c10d708114726fa46700000000000000000000000000000000000000000000000000000000000009c400000000000000000000000000000000000000000000000000000000000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda02913000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda02913000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000044095ea7b300000000000000000000000019ceead7105607cd444f5ad10dd51356436095a1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda0291300000000000000000000000019ceead7105607cd444f5ad10dd51356436095a10000000000000000000000000000000000000000000000000000000000000080ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000001e43b635ce4000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda0291300000000000000000000000000000000000000000000000000000000000000000000000000000000000000007882570840a97a490a37bd8db9e1ae39165bfbd6000000000000000000000000c1cba3fcea344f92d9239c08c0568f6f2f0ee4520000000000000000000000000000000000000000000000000002666c1c8ba2c40000000000000000000000000000000000000000000000000002570fcf082518000000000000000000000000ea49d02c248b357b99670d9e9741f54f72df9cb300000000000000000000000000000000000000000000000000000000000001400000000000000000000000007882570840a97a490a37bd8db9e1ae39165bfbd600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000070010205000a01020203000234000100010401800001aaff000000000000000000b9977af7dfae32c1633cfe9366e1d763caffdacfb4cb800910b228ed3d0834cf79d697127bbb00e5833589fcd6edb6e08f4c7c32d4f71b54bda0291342000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c1cba3fcea344f92d9239c08c0568f6f2f0ee452000000000000000000000000c1cba3fcea344f92d9239c08c0568f6f2f0ee452000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000044095ea7b3000000000000000000000000a238dd80c259a72e81d7e4664a9801593f98d1c5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c1cba3fcea344f92d9239c08c0568f6f2f0ee452000000000000000000000000a238dd80c259a72e81d7e4664a9801593f98d1c5000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000084617ba037000000000000000000000000c1cba3fcea344f92d9239c08c0568f6f2f0ee45200000000000000000000000000000000000000000000000000000000000000000000000000000000000000006d113e55a391e6ba1de2b41dacfbfa9a2afa7e5f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        );
        console.log("dataValidation", dataValidation);

        expect(dataValidation[0]).to.equal(true);
      });
    });

  });
});
