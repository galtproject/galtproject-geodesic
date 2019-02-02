const galt = require('@galtproject/utils');

const { deployGeodesic, clearLibCache } = require('../helpers');

contract.only('Geodesic', () => {
  before(clearLibCache);

  beforeEach(async function() {
    this.geodesic = await deployGeodesic();
  });

  it('should calculate contour area correctly', async function() {
    const shouldBeArea = 500882.5;

    const contour = ['k6wnu5q1jh44', 'k6wnu7d6tj8x', 'k6wnu6umb4b4', 'k6wnu60xk405', 'k6wnu4m0pvxy'].map(
      galt.geohashToGeohash5
    );
    let res = await this.geodesic.cacheGeohashListToLatLonAndUtm(contour);
    console.log('gasUsed for cache', res.receipt.gasUsed);
    res = await this.geodesic.calculateContourArea(contour);
    console.log('gasUsed for calculate', res.receipt.gasUsed);
    assert.isBelow(Math.abs(res.logs[0].args.area.toString(10) / 10 ** 18 - shouldBeArea), 1.5);

    const viewRes = await this.geodesic.getContourArea(contour);
    assert.equal(res.logs[0].args.area.toString(10), viewRes.toString());
  });
});
