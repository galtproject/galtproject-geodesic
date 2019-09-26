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
pragma solidity 0.5.10;

import "@galtproject/libs/contracts/collections/RedBlackTree.sol";
import "../utils/SegmentUtils.sol";
import "../utils/SweepEventUtils.sol";
import "../structs/SweepEvent.sol";


library SweepLineRedBlackTree {
  using RedBlackTree for RedBlackTree.Tree;
  
  uint internal constant ZERO = 0;

  function insert(SweepEvent.Tree storage sweepEvents, SweepEvent.Store storage store, uint key) internal {
    uint y = ZERO;
    uint x = sweepEvents.tree.root;
    
    while (x != ZERO) {
      y = x;
      int8 compareResult = SweepEventUtils.compareSegments(store, store.sweepById[key], store.sweepById[x]);
      if (compareResult < 0) {
        x = sweepEvents.tree.items[x].left;
      } else {
        if (compareResult == 0) {
          return;
        }
        x = sweepEvents.tree.items[x].right;
      }
    }
    sweepEvents.tree.items[key].parent = y;
    sweepEvents.tree.items[key].red = true;

    if (y == ZERO) {
      sweepEvents.tree.root = key;
    } else if (SweepEventUtils.compareSegments(store, store.sweepById[key], store.sweepById[y]) < 0) {
      sweepEvents.tree.items[y].left = key;
    } else {
      sweepEvents.tree.items[y].right = key;
    }
    sweepEvents.tree.insertFixup(key);
    sweepEvents.tree.inserted++;
  }
  

  function getNewId(SweepEvent.Tree storage sweepEvents) public view returns(uint256) {
    return sweepEvents.tree.inserted + 1;
  }
}
