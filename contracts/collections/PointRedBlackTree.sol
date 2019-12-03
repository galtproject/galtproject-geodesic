/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

pragma solidity ^0.5.13;

import "@galtproject/libs/contracts/collections/RedBlackTree.sol";
import "../utils/PointUtils.sol";


library PointRedBlackTree {
  using RedBlackTree for RedBlackTree.Tree;

  struct PointsTree {
    RedBlackTree.Tree tree;
    mapping(uint => int256[2]) values;
  }

  uint internal constant ZERO = 0;

  function find(PointsTree storage points, int256[2] memory value) public view returns (uint) {
    uint _key = points.tree.root;
    while (_key != ZERO) {
      int8 compareResult = PointUtils.comparePoints(value, points.values[_key]);
      if (compareResult == 0) {
        return _key;
      }
      if (compareResult < 0) {
        _key = points.tree.items[_key].left;
      } else {
        _key = points.tree.items[_key].right;
      }
    }
    return ZERO;
  }

  function insert(PointsTree storage points, uint key, int256[2] memory value) public {
    uint y = ZERO;
    uint x = points.tree.root;
    while (x != ZERO) {
      y = x;
      int8 compareResult = PointUtils.comparePoints(value, points.values[x]);
      if (compareResult < 0) {
        x = points.tree.items[x].left;
      } else {
        if (compareResult == 0) {
          return;
        }
        x = points.tree.items[x].right;
      }
    }
    points.tree.items[key] = RedBlackTree.Item(y, ZERO, ZERO, true);
    points.values[key] = value;

    if (y == ZERO) {
      points.tree.root = key;
    } else if (PointUtils.comparePoints(points.values[key], points.values[y]) < 0) {
      points.tree.items[y].left = key;
    } else {
      points.tree.items[y].right = key;
    }
    points.tree.insertFixup(key);
    points.tree.inserted++;
  }

  function getNewId(PointsTree storage points) public view returns(uint256) {
    return points.tree.inserted + 1;
  }

  function pop(PointsTree storage points) public returns(uint256 id, int256[2] memory value) {
    id = points.tree.pop();
    value = points.values[id];
  }

  function isEmpty(PointsTree storage points) public view returns(bool) {
    return points.tree.inserted == points.tree.removed;
  }
}
