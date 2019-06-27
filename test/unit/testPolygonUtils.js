const PolygonUtils = artifacts.require('./utils/PolygonUtils.sol');
const LandUtils = artifacts.require('./utils/LandUtils.sol');
const TrigonometryUtils = artifacts.require('./utils/TrigonometryUtils.sol');
const MockPolygonUtils = artifacts.require('./mocks/MockPolygonUtils.sol');

const galt = require('@galtproject/utils');
const pIteration = require('p-iteration');
const { initHelperWeb3, ether, weiToEther } = require('../helpers');

const { web3 } = MockPolygonUtils;

initHelperWeb3(web3);

contract('PolygonUtils', ([coreTeam]) => {
  beforeEach(async function() {
    this.trigonometryUtils = await TrigonometryUtils.new({ from: coreTeam });
    PolygonUtils.link('TrigonometryUtils', this.trigonometryUtils.address);
    this.landUtils = await LandUtils.new({ from: coreTeam });
    PolygonUtils.link('LandUtils', this.landUtils.address);
    MockPolygonUtils.link('LandUtils', this.landUtils.address);
    this.polygonUtils = await PolygonUtils.new({ from: coreTeam });
    MockPolygonUtils.link('PolygonUtils', this.polygonUtils.address);
    this.mockPolygonUtils = await MockPolygonUtils.new({ from: coreTeam });
  });

  describe('#getArea()', () => {
    // https://geographiclib.sourceforge.io/cgi-bin/Planimeter

    it('should correctly get north area', async function() {
      const contour = [
        [1.2291728239506483, 104.51007032766938],
        [1.2037726398557425, 104.50989866629243],
        [1.2036009784787893, 104.53199403360486],
        // [1.227113390341401, 104.53336732462049]
      ];

      const etherContour = contour.map(point => point.map(c => ether(c)));
      await pIteration.forEachSeries(etherContour, async point => {
        await this.mockPolygonUtils.addPoint(point);
      });

      const jsArea = galt.utm.area(contour.map(point => galt.utm.fromLatLon(point[0], point[1])));
      console.log('jsArea', jsArea);

      const res = await this.mockPolygonUtils.getArea();
      const solArea = weiToEther(res.logs[0].args.result);
      console.log('solArea', solArea);

      assert.isBelow(Math.abs(Math.abs(solArea) - Math.abs(jsArea)), 4);
    });

    it('should correctly get south area', async function() {
      const contour = [
        [-29.732930241152644, 19.87173842266202], // k6wnu5q1jh44
        [-29.731290573254228, 19.877572897821665], // k6wnu7d6tj8x
        [-29.734868137165904, 19.88010423257947], // k6wnu6umb4b4
        [-29.73873437382281, 19.87512605264783], // k6wnu60xk405
        [-29.7385863494128, 19.870490860193968] // k6wnu4m0pvxy
      ];

      const etherContour = contour.map(point => point.map(c => ether(Math.round(c * 10 ** 12) / 10 ** 12)));
      await pIteration.forEachSeries(etherContour, async point => {
        await this.mockPolygonUtils.addPoint(point);
      });

      const res = await this.mockPolygonUtils.getArea();

      assert.isBelow(Math.abs(res.logs[0].args.result.toString(10) / 10 ** 18 - 500882.5), 1.5);
    });
  });
});
