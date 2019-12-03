/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

pragma solidity ^0.5.13;

import "@galtproject/math/contracts/MathUtils.sol";


library PointUtils {

  int256 internal constant EPS = 1000000000;

  function comparePoints(int[2] memory a, int[2] memory b) internal pure returns (int8) {
    if (a[0] - b[0] > EPS || (MathUtils.abs(a[0] - b[0]) < EPS && a[1] - b[1] > EPS)) {
      return 1;
    } else if (b[0] - a[0] > EPS || (MathUtils.abs(a[0] - b[0]) < EPS && b[1] - a[1] > EPS)) {
      return - 1;
    } else if (MathUtils.abs(a[0] - b[0]) < EPS && MathUtils.abs(a[1] - b[1]) < EPS) {
      return 0;
    }
  }

  function isEqual(int[2] memory a, int[2] memory b) internal pure returns (bool) {
    return a[0] == b[0] && a[1] == b[1];
  }

  function isEqualEPS(int[2] memory a, int[2] memory b) internal pure returns (bool) {
    return MathUtils.abs(a[0] - b[0]) < EPS && MathUtils.abs(a[1] - b[1]) < EPS;
  }
}
