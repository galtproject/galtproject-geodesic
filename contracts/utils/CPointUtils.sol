/*
 * Copyright ©️ 2018 Galt•Project Society uint256 public constantruction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

pragma solidity ^0.5.13;


library CPointUtils {

  uint256 public constant XYZ_MASK =    uint256(0x000000000000000000000000ffffffffffffffffffffffffffffffffffffffff);
  uint256 public constant XY_MASK =     uint256(0x00000000000000000000000000000000ffffffffffffffffffffffffffffffff);
  uint256 public constant HEIGHT_MASK = uint256(0x000000000000000000000000ffffffff00000000000000000000000000000000);
  uint256 public constant LAT_MASK =    uint256(0x00000000000000000000000000000000ffffffffffffffff0000000000000000);
  uint256 public constant LON_MASK =    uint256(0x000000000000000000000000000000000000000000000000ffffffffffffffff);
  uint256 public constant INT64_MASK =  uint256(0xffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000);
  uint256 public constant INT32_MASK =  uint256(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000);

  // -2_147_483_648
  int256 constant Z_MIN = int256(-2147483648);
  // 2_147_483_647
  int256 constant Z_MAX = int256(2147483647);

  int256 constant DECIMALS = 10 ** 8;

  // LAT/LON/HEIGHT

  function cPointToLat(uint256 _cPoint) internal pure returns (int256) {
    return int256(int64(((_cPoint & LAT_MASK) >> 64) ^ INT64_MASK)) * DECIMALS;
  }

  function cPointToLon(uint256 _cPoint) internal pure returns (int256) {
    return int256(int64((_cPoint & LON_MASK) ^ INT64_MASK)) * DECIMALS;
  }

  function cPointToHeight(uint256 _cPoint) internal pure returns (int256) {
    return int32(((_cPoint & HEIGHT_MASK) >> 128) ^ INT32_MASK);
  }

  // COMBINATIONS

  function cPointToLatLonHeight(uint256 _cPoint) internal pure returns (int256 lat, int256 lon, int256 height) {
    lat = cPointToLat(_cPoint);
    lon = cPointToLon(_cPoint);
    height = cPointToHeight(_cPoint);
  }

  function cPointToLatLonArr(uint256 _cPoint) internal pure returns (int256[2] memory) {
    return [
      cPointToLat(_cPoint),
      cPointToLon(_cPoint)
    ];
  }

  function cPointToLatLon(uint256 _cPoint) internal pure returns (int256 lat, int256 lon) {
    lat = cPointToLat(_cPoint);
    lon = cPointToLon(_cPoint);
  }

  function latLonHeightToCPoint(int256 _lat, int256 _lon, int256 _height) internal pure returns (uint256 cPoint) {
    requireHeightValid(_height);

    int256 lat = (_lat / DECIMALS) << 64;
    int256 height = _height << 128;

    return uint256(((((bytes32(_lon / DECIMALS) & bytes32(LON_MASK)) ^ bytes32(lat)) & bytes32(XY_MASK)) ^ bytes32(height)) & bytes32(XYZ_MASK));
  }

  function requireHeightValid(int256 _height) pure internal {
    require(Z_MIN <= _height && _height <= Z_MAX, "CPointUtils: height overflow");
  }

  function isHeightValid(int256 _height) pure internal returns (bool) {
    return (Z_MIN <= _height && _height <= Z_MAX);
  }
}
