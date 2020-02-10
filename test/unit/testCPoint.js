const CPointUtils = artifacts.require('./utils/CPointUtils.sol');
const CPointUtilsPublic = artifacts.require('./utils/CPointUtilsPublic.sol');

CPointUtils.numberFormat = 'String';
CPointUtilsPublic.numberFormat = 'String';

const { web3 } = CPointUtilsPublic;

const { assertRevert, initHelperWeb3, ether } = require('../helpers');

initHelperWeb3(web3);

contract('CPoint', () => {
  let cPoint;

  beforeEach(async function() {
    cPoint = await CPointUtilsPublic.new();
  });

  // overflowed height
  const overflowedHeight = 2147483648;
  // underflowed height
  const underflowedHeight = 4294967298;

  // 0xb000000178ac21666000000bb8eeb4582
  const aPointString = '3743106037995514404663181823400999601538';
  // 0xffff5bf0ffffffe8753de99affffff447114ba7e
  const bPointString = '1461487345811774603843966527898531095244979878526';
  const aPoint = { lat: ether(10.1112223334), lon: ether(80.5556667778), height: 11 };
  const bPoint = { lat: ether(-10.1112223334), lon: ether(-80.5556667778), height: -42000 };

  describe('positive', () => {
    it('#cPointToLat()', async function() {
      assert.equal(await cPoint.cPointToLat(aPointString), aPoint.lat);
    });

    it('#cPointToLon()', async function() {
      assert.equal(await cPoint.cPointToLon(aPointString), aPoint.lon);
    });

    it('#cPointToHeight()', async function() {
      assert.equal(await cPoint.cPointToHeight(aPointString), aPoint.height);
    });

    it('#cPointToLatLonHeight()', async function() {
      const res = await cPoint.cPointToLatLonHeight(aPointString);
      assert.equal(res.lat, aPoint.lat);
      assert.equal(res.lon, aPoint.lon);
      assert.equal(res.height, aPoint.height);
    });

    it('#cPointToLatLonArr()', async function() {
      const res = await cPoint.cPointToLatLonArr(aPointString);
      assert.equal(res[0], aPoint.lat);
      assert.equal(res[1], aPoint.lon);
    });

    it('#cPointToLatLon()', async function() {
      const res = await cPoint.cPointToLatLon(aPointString);
      assert.equal(res.lat, aPoint.lat);
      assert.equal(res.lon, aPoint.lon);
    });

    it('#latLonHeightToCPoint()', async function() {
      const res = await cPoint.latLonHeightToCPoint(aPoint.lat, aPoint.lon, aPoint.height);
      assert.equal(res, aPointString);
    });

    it('#latLonHeightToCPoint() overflow', async function() {
      await assertRevert(cPoint.latLonHeightToCPoint(aPoint.lat, aPoint.lon, overflowedHeight));
    });
  });

  describe('negative', () => {
    it('#cPointToLat()', async function() {
      assert.equal(await cPoint.cPointToLat(bPointString), bPoint.lat);
    });

    it('#cPointToLon()', async function() {
      assert.equal(await cPoint.cPointToLon(bPointString), bPoint.lon);
    });

    it('#cPointToHeight()', async function() {
      assert.equal(await cPoint.cPointToHeight(bPointString), bPoint.height);
    });

    it('#cPointToLatLonHeight()', async function() {
      const res = await cPoint.cPointToLatLonHeight(bPointString);
      assert.equal(res.lat, bPoint.lat);
      assert.equal(res.lon, bPoint.lon);
      assert.equal(res.height, bPoint.height);
    });

    it('#cPointToLatLonArr()', async function() {
      const res = await cPoint.cPointToLatLonArr(bPointString);
      assert.equal(res[0], bPoint.lat);
      assert.equal(res[1], bPoint.lon);
    });

    it('#cPointToLatLon()', async function() {
      const res = await cPoint.cPointToLatLon(bPointString);
      assert.equal(res.lat, bPoint.lat);
      assert.equal(res.lon, bPoint.lon);
    });

    it('#latLonHeightToCPoint()', async function() {
      const res = await cPoint.latLonHeightToCPoint(bPoint.lat, bPoint.lon, bPoint.height);
      assert.equal(res, bPointString);
    });

    it('#latLonHeightToCPoint() underflow', async function() {
      await assertRevert(cPoint.latLonHeightToCPoint(bPoint.lat, bPoint.lon, underflowedHeight));
    });
  });
});
