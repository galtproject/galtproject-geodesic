pragma solidity 0.5.10;

import "../utils/GeohashUtils.sol";


contract MockGeohashUtils {
  event LogPrecisionResult(uint8 result);
  
  constructor() public {

  }

  function geohash5Precision(uint256 geohash) pure public returns(uint8 result) {
    result = GeohashUtils.geohash5Precision(geohash);
  }

  function isHeightValid(int256 _height) pure public returns (bool) {
    return GeohashUtils.isHeightValid(_height);
  }

  function geohash5ToGeohash5z(int256 _height, uint256 _geohash5) pure public returns (uint256) {
    return GeohashUtils.geohash5ToGeohash5z(_height, _geohash5);
  }

  function geohash5ToGeohash5zBytes32(int256 _height, uint256 _geohash5) pure public returns (bytes32) {
    return GeohashUtils.geohash5ToGeohash5zBytes32(_height, _geohash5);
  }

  function geohash5zToHeightAndGeohash5(uint256 _geohash5z) pure public returns (int256 height, uint256 geohash5) {
    return GeohashUtils.geohash5zToHeightAndGeohash5(_geohash5z);
  }

  function geohash5zToGeohash5(uint256 _geohash5z) pure public returns (uint256) {
    return GeohashUtils.geohash5zToGeohash5(_geohash5z);
  }

  function geohash5zToHeight(uint256 _geohash5z) pure public returns (int256) {
    return GeohashUtils.geohash5zToHeight(_geohash5z);
  }

  function geohash5zToHeightAndGeohash5Bytes32(
    uint256 _geohash5z
  )
    pure
    public
    returns (bytes32 height, bytes32 geohash5)
  {
    return GeohashUtils.geohash5zToHeightAndGeohash5Bytes32(_geohash5z);
  }

  function requireHeightValid(int256 _height) pure public {
    return GeohashUtils.requireHeightValid(_height);
  }
}
