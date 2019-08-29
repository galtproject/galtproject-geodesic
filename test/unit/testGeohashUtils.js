const GeohashUtils = artifacts.require('./utils/GeohashUtils.sol');
const MockGeohashUtils = artifacts.require('./mocks/MockGeohashUtils.sol');

GeohashUtils.numberFormat = 'String';

const { assertRevert, numberToEvmWord } = require('../helpers');

contract('GeoHashUtils', ([deployer]) => {
  beforeEach(async function() {
    this.utils = await GeohashUtils.new({ from: deployer });
    this.geohashUtils = this.utils;

    MockGeohashUtils.link('GeohashUtils', this.utils.address);
    this.mockGeohashUtils = await MockGeohashUtils.new({ from: deployer });
    this.geohash5Precision = async geohash5 => {
      const res = await this.mockGeohashUtils.geohash5Precision(geohash5);
      return res.logs[0].args.result;
    };
  });

  describe('#geohash5Precision()', () => {
    it('provide correct results', async function() {
      assert.equal(await this.geohash5Precision('1'), 1);
      assert.equal(await this.geohash5Precision('15'), 1);
      assert.equal(await this.geohash5Precision('31'), 1);
      assert.equal(await this.geohash5Precision('32'), 2);
      assert.equal(await this.geohash5Precision('1023'), 2);
      assert.equal(await this.geohash5Precision('1024'), 3);
      assert.equal(await this.geohash5Precision('32767'), 3);
      assert.equal(await this.geohash5Precision('32768'), 4);
      assert.equal(await this.geohash5Precision('1048575'), 4);
      assert.equal(await this.geohash5Precision('1048576'), 5);
      assert.equal(await this.geohash5Precision('33554431'), 5);
      assert.equal(await this.geohash5Precision('33554432'), 6);
      assert.equal(await this.geohash5Precision('1073741823'), 6);
      assert.equal(await this.geohash5Precision('1073741824'), 7);
      assert.equal(await this.geohash5Precision('34359738367'), 7);
      assert.equal(await this.geohash5Precision('34359738368'), 8);
      assert.equal(await this.geohash5Precision('1099511627775'), 8);
      assert.equal(await this.geohash5Precision('1099511627776'), 9);
      assert.equal(await this.geohash5Precision('35184372088831'), 9);
      assert.equal(await this.geohash5Precision('35184372088832'), 10);
      assert.equal(await this.geohash5Precision('1125899906842623'), 10);
      assert.equal(await this.geohash5Precision('1125899906842624'), 11);
      assert.equal(await this.geohash5Precision('36028797018963967'), 11);
      assert.equal(await this.geohash5Precision('36028797018963968'), 12);
      assert.equal(await this.geohash5Precision('1152921504606846975'), 12);
    });

    it('should return 0 on 0 input', async function() {
      assert.equal(await this.geohash5Precision('0'), 0);
    });

    it('should revert if a value is greater than max', async function() {
      // max is 1152921504606846975
      await assertRevert(this.geohash5Precision('1152921504606846976'));
    });
  });

  describe('geohash5z', () => {
    // 0x00004627
    const height = 17959;
    // 0xfffbb722
    const negativeHeight = -280798;
    // overflowed height
    const overflowedHeight = 2147483648;
    // underflowed height
    // const underflowedHeight = 4294967298;
    // u33d9u9n4juh
    const geohash5 = '940245506947434320';

    const positiveGeohash5z = web3.utils.hexToNumberString(
      '0x0000000000000000000000000000000000004627000000000d0c6c4e93424750'
    );
    const negativeGeohash5z = web3.utils.hexToNumberString(
      '0x00000000000000000000000000000000fffbb722000000000d0c6c4e93424750'
    );

    describe('#geohash5ToGeohash5z()', () => {
      it('should encode positive height into geohash5', async function() {
        const res = await this.geohashUtils.geohash5ToGeohash5z(height, geohash5);
        assert.equal(numberToEvmWord(res), '0x0000000000000000000000000000000000004627000000000d0c6c4e93424750');
      });

      it('should encode positive height into geohash5 bytes32', async function() {
        const res = await this.geohashUtils.geohash5ToGeohash5zBytes32(height, geohash5);
        assert.equal(res, '0x0000000000000000000000000000000000004627000000000d0c6c4e93424750');
      });

      it('should encode negative height into geohash5', async function() {
        const res = await this.geohashUtils.geohash5ToGeohash5zBytes32(negativeHeight, geohash5);
        assert.equal(numberToEvmWord(res), '0x00000000000000000000000000000000fffbb722000000000d0c6c4e93424750');
      });

      it('should encode negative height into geohash5 bytes32', async function() {
        const res = await this.geohashUtils.geohash5ToGeohash5zBytes32(negativeHeight, geohash5);
        assert.equal(res, '0x00000000000000000000000000000000fffbb722000000000d0c6c4e93424750');
      });

      it('should encode positive height into geohash5', async function() {
        await assertRevert(this.geohashUtils.geohash5ToGeohash5z(overflowedHeight, geohash5));
      });
    });

    describe('#geohash5zToGeohash5()', () => {
      it('should decode positive height and geohash5', async function() {
        const res = await this.geohashUtils.geohash5zToGeohash(positiveGeohash5z);
        assert.equal(res.height, height);
        assert.equal(res.geohash5, geohash5);
      });

      it('should decode positive height and geohash5 in bytes32 format', async function() {
        const res = await this.geohashUtils.geohash5zToGeohashBytes32(positiveGeohash5z);
        assert.equal(res.height, '0x0000000000000000000000000000000000000000000000000000000000004627');
        assert.equal(res.geohash5, '0x0000000000000000000000000000000000000000000000000d0c6c4e93424750');
      });

      it('should decode negative height and geohash5', async function() {
        const res = await this.geohashUtils.geohash5zToGeohash(negativeGeohash5z);
        assert.equal(res.height, negativeHeight);
        assert.equal(res.geohash5, geohash5);
      });

      it('should decode negative height and geohash5 in bytes32 format', async function() {
        const res = await this.geohashUtils.geohash5zToGeohashBytes32(negativeGeohash5z);
        assert.equal(res.height, '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffbb722');
        assert.equal(res.geohash5, '0x0000000000000000000000000000000000000000000000000d0c6c4e93424750');
      });
    });
  });
});
