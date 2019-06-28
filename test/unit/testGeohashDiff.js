const galt = require('@galtproject/utils');
const pIteration = require('p-iteration');

const { deployGeodesic, clearLibCache, weiToEther } = require('../helpers');

contract('Geodesic', () => {
  before(clearLibCache);

  let geodesic;
  beforeEach(async () => {
    geodesic = await deployGeodesic();
  });

  it('should calculate contour area correctly', async () => {
    const testData = [
      {
        sourceGeohash: 'qgqxf8yh0j2h',
        shiftX: 0.5,
        shiftY: 0
      },
      {
        sourceGeohash: 'qx8b0quh0j00',
        shiftX: 1,
        shiftY: 0
      },
      {
        sourceGeohash: 'kd9s8ms58081',
        shiftX: 5,
        shiftY: 0
      },
      {
        sourceGeohash: 's3wf02s1b4b4',
        shiftX: 10,
        shiftY: 0
      },
      {
        sourceGeohash: 'sj3t2mk08p2h',
        shiftX: 0.5,
        shiftY: 10
      },
      {
        sourceGeohash: 'spug5shd9g0p',
        shiftX: 1,
        shiftY: 5
      },
      {
        sourceGeohash: 'udhz26sjb520',
        shiftX: 5,
        shiftY: 1
      },
      {
        sourceGeohash: 'us7g8mk18084',
        shiftX: 10,
        shiftY: 0.5
      }
    ];

    await pIteration.forEach(testData, async testItem => {
      const sourceUtm = galt.geohash.extra.decodeToUtm(testItem.sourceGeohash, true);
      const sourceUtmX = sourceUtm.x;
      const sourceUtmY = sourceUtm.y;

      sourceUtm.x += testItem.shiftX;
      sourceUtm.y += testItem.shiftY;

      const destinationUtmX = sourceUtm.x;
      const destinationUtmY = sourceUtm.y;

      const destinationGeohash = galt.geohash.extra.encodeFromUtm(sourceUtm, 12);
      const geohashNumbers = [testItem.sourceGeohash, destinationGeohash].map(galt.geohashToGeohash5);
      await geodesic.cacheGeohashListToLatLonAndUtm(geohashNumbers);

      const sourceContractUtm = await geodesic.getCachedUtmByGeohash(geohashNumbers[0]);
      const destinationContractUtm = await geodesic.getCachedUtmByGeohash(geohashNumbers[1]);

      const contractSourceUtmX = weiToEther(sourceContractUtm[0]);
      const contractSourceUtmY = weiToEther(sourceContractUtm[1]);
      const contractDestinatonUtmX = weiToEther(destinationContractUtm[0]);
      const contractDestinatonUtmY = weiToEther(destinationContractUtm[1]);

      console.log(testItem.sourceGeohash);
      console.log(sourceUtmX - contractSourceUtmX);
      console.log(sourceUtmY - contractSourceUtmY);
      console.log(destinationUtmX - contractDestinatonUtmX);
      console.log(destinationUtmY - contractDestinatonUtmY);
      assert.isBelow(Math.abs(sourceUtmX - contractSourceUtmX), 0.07);
      assert.isBelow(Math.abs(sourceUtmY - contractSourceUtmY), 0.07);
      assert.isBelow(Math.abs(destinationUtmX - contractDestinatonUtmX), 0.07);
      assert.isBelow(Math.abs(destinationUtmY - contractDestinatonUtmY), 0.07);
    });
  });
});
