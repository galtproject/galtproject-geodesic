/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

pragma solidity ^0.5.13;

import "../utils/LandUtils.sol";


interface IGeodesic {
  event ContourAreaCalculate(uint256[] contour, uint256 area);

  function cacheGeohashToLatLon(uint256 _geohash) external returns (int256[2] memory);

  function cacheGeohashListToLatLon(uint256[] calldata _geohashList) external;

  function cacheGeohashToLatLonAndUtm(uint256 _geohash) external returns (int256[3] memory);

  function cacheLatLonToGeohash(int256[2] calldata point, uint8 precision) external returns (uint256);

  function cacheLatLonListToGeohash(int256[2][] calldata _pointList, uint8 precision) external;

  function calculateContourArea(uint256[] calldata contour) external returns (uint256 area);

  function getContourArea(uint256[] calldata contour) external view returns (uint256 area);

  function getCachedLatLonByGeohash(uint256 _geohash) external view returns (int256[2] memory);

  function getCachedGeohashByLatLon(int256[2] calldata point, uint8 precision) external view returns (uint256);

  function getCachedUtmByGeohash(uint256 _geohash) external view returns (int256[3] memory);

  function getCachedUtmByLatLon(int256[2] calldata point) external view returns (int256[3] memory);

  function getNotCachedGeohashes(uint256[] calldata _geohashList) external view returns (uint256[] memory);
}
