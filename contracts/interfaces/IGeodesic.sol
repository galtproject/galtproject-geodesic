/*
 * Copyright ©️ 2018 Galt•Space Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka),
 * [Dima Starodubcev](https://github.com/xhipster),
 * [Valery Litvin](https://github.com/litvintech) by
 * [Basic Agreement](http://cyb.ai/QmSAWEG5u5aSsUyMNYuX2A2Eaz4kEuoYWUkVBRdmu9qmct:ipfs)).
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) and
 * Galt•Space Society Construction and Terraforming Company by
 * [Basic Agreement](http://cyb.ai/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS:ipfs)).
 */
pragma solidity 0.5.3;

import "../utils/LandUtils.sol";


contract IGeodesic {
  LandUtils.LatLonData private geodesicData;
  event ContourAreaCalculate(uint256[] contour, uint256 area);

  function cacheGeohashToLatLon(uint256 _geohash) public returns (int256[2] memory);

  function cacheGeohashListToLatLon(uint256[] memory _geohashList) public;

  function cacheGeohashToLatLonAndUtm(uint256 _geohash) public returns (int256[3] memory);

  function cacheLatLonToGeohash(int256[2] memory point, uint8 precision) public returns (uint256);

  function cacheLatLonListToGeohash(int256[2][] memory _pointList, uint8 precision) public;

  function calculateContourArea(uint256[] calldata contour) external returns (uint256 area);
  
  function getContourArea(uint256[] calldata contour) external view returns (uint256 area);

  function getCachedLatLonByGeohash(uint256 _geohash) public view returns (int256[2] memory);

  function getCachedGeohashByLatLon(int256[2] memory point, uint8 precision) public view returns (uint256);

  function getCachedUtmByGeohash(uint256 _geohash) public view returns (int256[3] memory);

  function getCachedUtmByLatLon(int256[2] memory point) public view returns (int256[3] memory);

  function getNotCachedGeohashes(uint256[] calldata _geohashList) external view returns (uint256[] memory);

  function getContourArea(uint256[] calldata contour) external view returns (uint256 area);
}
