const galt = require('@galtproject/utils');

const { deployGeodesic, clearLibCache, assertRevert } = require('../helpers');

contract('Geodesic', () => {
  before(clearLibCache);

  const areaAccurancy = 7;

  let geodesic;
  beforeEach(async () => {
    geodesic = await deployGeodesic();
  });

  it('should calculate contour area correctly', async () => {
    const geohashContour = ['k6wnu5q1jh44', 'k6wnu7d6tj8x', 'k6wnu6umb4b4', 'k6wnu60xk405', 'k6wnu4m0pvxy'];
    const shouldBeArea = galt.geohash.contour.area(geohashContour);

    const contour = geohashContour.map(galt.geohashToGeohash5);
    let res = await geodesic.cacheGeohashListToLatLonAndUtm(contour);
    console.log('gasUsed for cache', res.receipt.gasUsed);
    res = await geodesic.calculateContourArea(contour);
    console.log('gasUsed for calculate', res.receipt.gasUsed);
    assert.isBelow(Math.abs(res.logs[0].args.area.toString(10) / 10 ** 18 - shouldBeArea), areaAccurancy);

    const viewRes = await geodesic.getContourArea(contour);
    assert.equal(res.logs[0].args.area.toString(10), viewRes.toString());
  });

  it('should calculate contour area correctly user case 1', async () => {
    const geohashContour = [
      'w24qfpvbmnkt',
      'w24qf5ju3pkx',
      'w24qfejgkp2p',
      'w24qftn244vj',
      'w24qfmpp2p00',
      'w24qfrx3sxuc'
    ];
    const shouldBeArea = galt.geohash.contour.area(geohashContour);

    const contour = geohashContour.map(galt.geohashToGeohash5);
    let res = await geodesic.cacheGeohashListToLatLonAndUtm(contour);
    console.log('gasUsed for cache', res.receipt.gasUsed);
    res = await geodesic.calculateContourArea(contour);
    console.log('gasUsed for calculate', res.receipt.gasUsed);
    assert.isBelow(Math.abs(res.logs[0].args.area.toString(10) / 10 ** 18 - shouldBeArea), areaAccurancy);

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

  it('should cache latLon to utm', async () => {
    const latLonContour = [
      [1.2291728239506483, 104.51007032766938],
      [1.2037726398557425, 104.50989866629243],
      [1.2036009784787893, 104.53199403360486],
      [1.227113390341401, 104.53336732462049]
    ].map(point => point.map(coor => Math.round(coor * 10 ** 18).toString()));

    await geodesic.cacheLatLonListToUtm(latLonContour);
    const cachedUtm = (await geodesic.getCachedUtmByLatLon(latLonContour[0])).map(u => parseInt(u.toString(10), 10));
    assert.notStrictEqual(cachedUtm, 0);
  });
});
