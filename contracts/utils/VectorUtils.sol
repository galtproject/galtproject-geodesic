/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

pragma solidity 0.5.10;

import "@galtproject/math/contracts/MathUtils.sol";


library VectorUtils {
  function onSegment(int[2] memory a, int[2] memory b, int[2] memory c) internal pure returns (bool) {
    /* solium-disable-next-line */
    return (MathUtils.minInt(a[0], b[0]) <= c[0]) && (c[0] <= MathUtils.maxInt(a[0], b[0])) &&
    /* solium-disable-next-line */
    (MathUtils.minInt(a[1], b[1]) <= c[1]) && (c[1] <= MathUtils.maxInt(a[1], b[1]));
  }

  function direction(int[2] memory a, int[2] memory b, int[2] memory c) internal pure returns (int256) {
    return (c[0] - a[0]) * (b[1] - a[1]) - (b[0] - a[0]) * (c[1] - a[1]);
  }
}
