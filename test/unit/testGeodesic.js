const galt = require('@galtproject/utils');

const { deployGeodesic, clearLibCache, assertRevert } = require('../helpers');

contract('Geodesic', () => {
  before(clearLibCache);

  let geodesic;
  beforeEach(async () => {
    geodesic = await deployGeodesic();
  });

  it('should calculate contour area correctly', async () => {
    const shouldBeArea = 500882.5;

    const contour = ['k6wnu5q1jh44', 'k6wnu7d6tj8x', 'k6wnu6umb4b4', 'k6wnu60xk405', 'k6wnu4m0pvxy'].map(
      galt.geohashToGeohash5
    );
    let res = await geodesic.cacheGeohashListToLatLonAndUtm(contour);
    console.log('gasUsed for cache', res.receipt.gasUsed);
    res = await geodesic.calculateContourArea(contour);
    console.log('gasUsed for calculate', res.receipt.gasUsed);
    assert.isBelow(Math.abs(res.logs[0].args.area.toString(10) / 10 ** 18 - shouldBeArea), 1.5);

    const viewRes = await geodesic.getContourArea(contour);
    assert.equal(res.logs[0].args.area.toString(10), viewRes.toString());
  });

  it('should reject getContourArea for not cached geohashes', async () => {
    await assertRevert(
      geodesic.getContourArea(['k6wnu7d6tj80', 'k6wnu7d6tj8x', 'k6wnu6umb4b4'].map(galt.geohashToGeohash5))
    );
  });

  it('getNotCachedGeohashes should return', async () => {
    const firstContour = ['k6wnu5q1jh44', 'k6wnu7d6tj8x', 'k6wnu6umb4b4', 'k6wnu60xk405', 'k6wnu4m0pvxy'].map(
      galt.geohashToGeohash5
    );

    let notCachedFirstContour = (await geodesic.getNotCachedGeohashes(firstContour)).map(geohashNumber =>
      geohashNumber.toString(10)
    );

    assert.equal(notCachedFirstContour.length, firstContour.length);
    assert.deepEqual(firstContour.map(geohashNumber => geohashNumber.toString(10)), notCachedFirstContour);

    await geodesic.cacheGeohashListToLatLonAndUtm(firstContour);

    notCachedFirstContour = await geodesic.getNotCachedGeohashes(firstContour);
    assert.equal(notCachedFirstContour.length, 0);

    const secondContour = ['k6wnu7d6tj80', 'k6wnu7d6tj8x', 'k6wnu6umb4b4'].map(galt.geohashToGeohash5);

    let notCachedSecondContour = (await geodesic.getNotCachedGeohashes(secondContour)).map(geohashNumber =>
      geohashNumber.toString(10)
    );
    assert.equal(notCachedSecondContour.length, 1);

    const shouldBeNotCachedArray = ['k6wnu7d6tj80'].map(geohash => galt.geohashToGeohash5(geohash).toString(10));
    assert.deepEqual(shouldBeNotCachedArray, notCachedSecondContour);

    await geodesic.cacheGeohashListToLatLonAndUtm(secondContour);

    notCachedSecondContour = await geodesic.getNotCachedGeohashes(firstContour);
    assert.equal(notCachedSecondContour.length, 0);
  });
});
