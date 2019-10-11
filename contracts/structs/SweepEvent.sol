/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

pragma solidity 0.5.10;

import "@galtproject/libs/contracts/collections/RedBlackTree.sol";


library SweepEvent {
  enum Type {
    NORMAL,
    SAME_TRANSITION,
    DIFFERENT_TRANSITION,
    NON_CONTRIBUTING
  }

  struct Item {
    uint256 id;
    uint256 otherEvent;

    int256 pos;

//    uint256 qId; // Id of SweepQueueRedBlackTree
//    uint256 lId; // Id of SweepLineRedBlackTree

    uint256 contourId;

    int256[2] point;
    bool left;
    bool isSubject;
    Type eventType;
    bool inOut;
    uint prevInResult;
    bool inResult;
    bool resultInOut; // possibly no needed
    bool otherInOut;
    bool isExteriorRing;
  }

  struct Tree {
    RedBlackTree.Tree tree;
//    mapping(uint => bool) exists;
  }

  struct Store {
    mapping(uint => SweepEvent.Item) sweepById;
  }
}
