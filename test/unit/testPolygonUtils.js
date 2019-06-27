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

    this.checkArea = async contour => {
      const etherContour = contour.map(point => point.map(c => ether(c)));
      await pIteration.forEachSeries(etherContour, async point => {
        await this.mockPolygonUtils.addPoint(point);
      });

      const jsArea = galt.utm.area(contour.map(point => galt.utm.fromLatLon(point[0], point[1])));

      const res = await this.mockPolygonUtils.getArea();
      const solArea = weiToEther(res.logs[0].args.result);
      const diff = Math.abs(Math.abs(solArea) - Math.abs(jsArea));
      const diffPercent = (diff / jsArea) * 100;

      assert.isBelow(diffPercent, 0.006);
    };
  });

  describe.only('#getArea()', () => {
    // https://geographiclib.sourceforge.io/cgi-bin/Planimeter

    it('should correctly get north area', async function() {
      await this.checkArea([
        [1.2291728239506483, 104.51007032766938],
        [1.2037726398557425, 104.50989866629243],
        [1.2036009784787893, 104.53199403360486],
        [1.227113390341401, 104.53336732462049]
      ]);
    });

    it('should correctly get south area', async function() {
      await this.checkArea([
        [-29.732930241152644, 19.87173842266202], // k6wnu5q1jh44
        [-29.731290573254228, 19.877572897821665], // k6wnu7d6tj8x
        [-29.734868137165904, 19.88010423257947], // k6wnu6umb4b4
        [-29.73873437382281, 19.87512605264783], // k6wnu60xk405
        [-29.7385863494128, 19.870490860193968] // k6wnu4m0pvxy
      ]);
    });

    it('should correctly get small south area', async function() {
      await this.checkArea([
        [47.8379212227, 1.9380644896], // u092hhek04ve
        [47.8376690951, 1.9388262369], // u092hhef9gve
        [47.8373306338, 1.9385794737], // u092hhe8shv8
        [47.8375899699, 1.9378069975] // u092hhe44jje
      ]);
    });

    it('should correctly get small south area', async function() {
      await this.checkArea([
        [47.8387314175, 1.9404077344], // u092hhubycbu
        [47.8386900109, 1.940517705], // u092hhv0964v
        [47.8385946248, 1.9404613786], // u092hhv0002u
        [47.8386341874, 1.9403433614] // u092hhubjrbb
      ]);
    });
  });
});
