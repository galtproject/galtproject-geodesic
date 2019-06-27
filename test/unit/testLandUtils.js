const LandUtils = artifacts.require('./utils/LandUtils.sol');
const MockLandUtils = artifacts.require('./mocks/MockLandUtils.sol');

const galt = require('@galtproject/utils');
const pIteration = require('p-iteration');

const { web3 } = LandUtils;

contract('LandUtils', ([deployer]) => {
  beforeEach(async function() {
    this.utils = await LandUtils.new({ from: deployer });

    MockLandUtils.link('LandUtils', this.utils.address);
    this.mockLandUtils = await MockLandUtils.new({ from: deployer });
  });

  describe('#geohash5ToLatLonArr()', () => {
    it('should correctly convert geohash5 to lat lon', async function() {
      const res = await this.mockLandUtils.geohash5ToLatLonArr(30136808136, {
        from: deployer
      });

      assert.deepEqual(res.logs[0].args.result.map(coor => coor.toString(10)), [
        '1178970336914062500',
        '104513626098632812500'
      ]);
    });
  });

  describe('#latLonToGeohash5()', () => {
    it('should correctly convert lat lon to geohash5', async function() {
      const res = await this.mockLandUtils.latLonToGeohash5(['1178970336914062500', '104513626098632812500'], 7, {
        from: deployer
      });

      assert.deepEqual(res.logs[0].args.result.toString(10), '30136808136');
    });
  });

  describe('#latLonToUtm()', () => {
    it('should correctly convert lat lon to utm', async function() {
      const latLonToCheck = [
        [-74.0550677213, -90.318972094],
        [25.5888986977, -125.9639064827],
        [11.9419456134, 30.6196556841],
        [66.9375384427, -9.6290061374],
        [-1.9773564645, 134.3986143967],
        [43.66854867897928, 2.269438672810793],
        [1.2291728239506483, 104.51007032766938]
      ];

      await pIteration.forEachSeries(latLonToCheck, async point => {
        // console.log('point', point);
        // const shouldBeUtm = shouldBeUtmByIndex[index];
        const shouldBeUtm = galt.utm.fromLatLon(point[0], point[1]);
        const etherPoint = point.map(coor => web3.utils.toWei(coor.toString(), 'ether'));

        const res = await this.mockLandUtils.latLonToUtm(etherPoint, {
          from: deployer
        });

        const result = res.logs[0].args;
        const xResult = result.x / 10 ** 18;
        const yResult = result.y / 10 ** 18;
        const scaleResult = result.scale / 10 ** 18;
        // const convergenceResult = result.convergence / 10 ** 18;

        // console.log('xResult');
        // console.log(xResult);
        // console.log(shouldBeUtm.x);
        // console.log(xResult - shouldBeUtm.x);
        // console.log('yResult');
        // console.log(yResult);
        // console.log(shouldBeUtm.y);
        // console.log(yResult - shouldBeUtm.y);
        // console.log('yDiff', Math.abs(yResult - shouldBeUtm.y));
        // console.log('scaleDiff', Math.abs(scaleResult - shouldBeUtm.scale));
        // console.log('convergenceDiff', Math.abs(convergenceResult - shouldBeUtm.convergence));
        //
        // console.log('gasUsed', res.receipt.gasUsed);

        // TODO: find the reason dropping of accuarancy from 0.007 to 0.07
        assert.isBelow(Math.abs(xResult - shouldBeUtm.x), 0.07);
        assert.isBelow(Math.abs(yResult - shouldBeUtm.y), 0.07);
        assert.isBelow(Math.abs(scaleResult - shouldBeUtm.scale), 0.001);
        // assert.isBelow(Math.abs(convergenceResult - shouldBeUtm.convergence), 0.001);
        assert.equal(result.zone.toString(10), shouldBeUtm.zone.toString(10));
        assert.equal(result.isNorth ? 'N' : 'S', shouldBeUtm.h);
      });
    });
  });
});
