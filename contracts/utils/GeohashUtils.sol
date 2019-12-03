/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

pragma solidity ^0.5.13;


library GeohashUtils {
  uint256 constant C1_GEOHASH = 31;
  uint256 constant C2_GEOHASH = 1023;
  uint256 constant C3_GEOHASH = 32767;
  uint256 constant C4_GEOHASH = 1048575;
  uint256 constant C5_GEOHASH = 33554431;
  uint256 constant C6_GEOHASH = 1073741823;
  uint256 constant C7_GEOHASH = 34359738367;
  uint256 constant C8_GEOHASH = 1099511627775;
  uint256 constant C9_GEOHASH = 35184372088831;
  uint256 constant C10_GEOHASH = 1125899906842623;
  uint256 constant C11_GEOHASH = 36028797018963967;
  uint256 constant C12_GEOHASH = 1152921504606846975;

  // bytes32("0123456789bcdefghjkmnpqrstuvwxyz")
  bytes32 constant GEOHASH5_MASK = 0x30313233343536373839626364656667686a6b6d6e707172737475767778797a;

  uint256 constant Z_RESERVED_MASK = uint256(0x0000000000000000000000000000000ffffffffffffffffffffffffffffffff);
  uint256 constant Z_HEIGHT_MASK =   uint256(0x0000000000000000000000000000000ffffffff000000000000000000000000);
  uint256 constant Z_INT32_MASK =    uint256(0xfffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000);
  uint256 constant Z_GEOHASH5_MASK = uint256(0x000000000000000000000000000000000000000ffffffffffffffffffffffff);

  // -2_147_483_648
  int256 constant Z_MIN = int256(-2147483648);
  // 2_147_483_647
  int256 constant Z_MAX = int256(2147483647);

  // TODO: use uint256 instead
  function geohash5Precision(uint256 _geohash5) internal pure returns (uint8) {
    if (_geohash5 == 0) {
      return 0;
    } else if (_geohash5 <= C1_GEOHASH) {
      return 1;
    } else if (_geohash5 <= C2_GEOHASH) {
      return 2;
    } else if (_geohash5 <= C3_GEOHASH) {
      return 3;
    } else if (_geohash5 <= C4_GEOHASH) {
      return 4;
    } else if (_geohash5 <= C5_GEOHASH) {
      return 5;
    } else if (_geohash5 <= C6_GEOHASH) {
      return 6;
    } else if (_geohash5 <= C7_GEOHASH) {
      return 7;
    } else if (_geohash5 <= C8_GEOHASH) {
      return 8;
    } else if (_geohash5 <= C9_GEOHASH) {
      return 9;
    } else if (_geohash5 <= C10_GEOHASH) {
      return 10;
    } else if (_geohash5 <= C11_GEOHASH) {
      return 11;
    } else if (_geohash5 <= C12_GEOHASH) {
      return 12;
    } else {
      revert("Invalid geohash5");
    }
  }

  function geohash5ToGeohashString(uint256 _input) pure internal returns (bytes32) {
    if (_input > C12_GEOHASH) {
      revert("Number exceeds the limit");
    }

    uint256 num = _input;
    bytes32 output;
    bytes32 fiveOn = bytes32(uint256(31));
    uint8 counter = 0;

    while (num != 0) {
      output = output >> 8;
      uint256 d = uint256(bytes32(num) & fiveOn);
      output = output ^ (bytes1(GEOHASH5_MASK[d]));
      num = num >> 5;
      counter++;
    }

    return output;
  }

  function geohash5ToGeohash5z(int256 _height, uint256 _geohash5) pure internal returns (uint256) {
    requireHeightValid(_height);
    uint256 shiftedHeight = uint256(_height) << 96;

    return (_geohash5 | shiftedHeight) & Z_RESERVED_MASK;
  }

  function geohash5ToGeohash5zBytes32(int256 _height, uint256 _geohash5) pure internal returns (bytes32) {
    return bytes32(geohash5ToGeohash5z(_height, _geohash5));
  }

  function geohash5zToHeightAndGeohash5(uint256 _geohash5z) pure internal returns (int256 height, uint256 geohash5) {
    height = int32((_geohash5z & Z_HEIGHT_MASK) >> 96);
    geohash5 = _geohash5z & Z_GEOHASH5_MASK;
  }

  function geohash5zToGeohash5(uint256 _geohash5z) pure internal returns (uint256) {
    return _geohash5z & Z_GEOHASH5_MASK;
  }

  function geohash5zToHeight(uint256 _geohash5z) pure internal returns (int256) {
    return int32((_geohash5z & Z_HEIGHT_MASK) >> 96);
  }

  function geohash5zToHeightAndGeohash5Bytes32(
    uint256 _geohash5z
  )
    pure
    internal
    returns (bytes32 height, bytes32 geohash5)
  {
    (int256 x, uint256 y) = geohash5zToHeightAndGeohash5(_geohash5z);
    return (bytes32(x), bytes32(y));
  }

  function requireHeightValid(int256 _height) pure internal {
    require(Z_MIN <= _height && _height <= Z_MAX, "GeohashUtils: height overflow");
  }

  function isHeightValid(int256 _height) pure internal returns (bool) {
    return (Z_MIN <= _height && _height <= Z_MAX);
  }

  function maxGeohashNumber() internal pure returns (uint256) {
    return C12_GEOHASH;
  }
}
