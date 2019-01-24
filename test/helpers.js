const Web3 = require('web3');

const { BN } = Web3.utils;

let web3;
let artifacts;

let requireCache = {};
let libCache = {};

const Helpers = {
  initHelperWeb3(_web3) {
    web3 = new Web3(_web3.currentProvider);
  },
  zeroAddress: '0x0000000000000000000000000000000000000000',
  hex(input) {
    return web3.utils.toHex(input);
  },
  gwei(number) {
    return web3.utils.toWei(number.toString(), 'gwei');
  },
  szabo(number) {
    return web3.utils.toWei(number.toString(), 'szabo');
  },
  ether(number) {
    return web3.utils.toWei(number.toString(), 'ether');
  },
  galt(number) {
    return web3.utils.toWei(number.toString(), 'ether');
  },
  roundToPrecision(number, precision = 4) {
    return Math.round(number * 10 ** precision) / 10 ** precision;
  },
  weiToEtherRound(wei, precision = 4) {
    return Helpers.roundToPrecision(parseFloat(web3.utils.fromWei(wei.toFixed(), 'ether')), precision);
  },
  log(...args) {
    console.log('>>>', new Date().toLocaleTimeString(), '>>>', ...args);
  },
  async sleep(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  },
  async assertInvalid(promise) {
    try {
      await promise;
    } catch (error) {
      const revert = error.message.search('invalid opcode') >= 0;
      assert(revert, `Expected INVALID (0xfe), got '${error}' instead`);
      return;
    }
    assert.fail('Expected INVALID (0xfe) not received');
  },
  async assertRevert(promise) {
    try {
      await promise;
    } catch (error) {
      const revert = error.message.search('revert') >= 0;
      assert(revert, `Expected throw, got '${error}' instead`);
      return;
    }
    assert.fail('Expected throw not received');
  },
  assertEqualBN(actual, expected) {
    assert(actual instanceof BN, 'Actual value isn not a BN instance');
    assert(expected instanceof BN, 'Expected value isn not a BN instance');

    assert(
      actual.toString(10) === expected.toString(10),
      `Expected ${web3.utils.fromWei(actual)} (actual) ether to be equal ${web3.utils.fromWei(
        expected
      )} ether (expected)`
    );
  },
  // TODO: Move functions with deploy of contracts to builders.js
  initHelperArtifacts(_artifacts) {
    artifacts = _artifacts;
  },
  clearRequireCache() {
    requireCache = {};
  },
  clearLibCache() {
    libCache = {};
  },
  requireContract(path) {
    if (!requireCache[path]) {
      requireCache[path] = artifacts.require(path);
    }
    return requireCache[path];
  },
  async getSegmentUtilsLib() {
    if (libCache.SegmentUtils) {
      return libCache.SegmentUtils;
    }
    const SegmentUtils = Helpers.requireContract('./utils/SegmentUtils.sol');
    libCache.SegmentUtils = await SegmentUtils.new();
    return libCache.SegmentUtils;
  },
  async getLandUtilsLib() {
    if (libCache.LandUtils) {
      return libCache.LandUtils;
    }
    const LandUtils = Helpers.requireContract('./utils/LandUtils.sol');
    libCache.LandUtils = await LandUtils.new();
    return libCache.LandUtils;
  },
  async getArrayUtilsLib() {
    if (libCache.ArrayUtils) {
      return libCache.ArrayUtils;
    }
    const ArrayUtils = Helpers.requireContract('./utils/ArrayUtils.sol');
    libCache.ArrayUtils = await ArrayUtils.new();
    return libCache.ArrayUtils;
  },
  async getPolygonUtilsLib() {
    if (libCache.PolygonUtils) {
      return libCache.PolygonUtils;
    }
    const PolygonUtils = Helpers.requireContract('./utils/PolygonUtils.sol');
    PolygonUtils.link('LandUtils', (await Helpers.getLandUtilsLib()).address);
    libCache.PolygonUtils = await PolygonUtils.new();
    return libCache.PolygonUtils;
  },
  async getRedBlackTreeLib() {
    if (libCache.RedBlackTree) {
      return libCache.RedBlackTree;
    }
    const RedBlackTree = Helpers.requireContract('./collections/RedBlackTree.sol');
    libCache.RedBlackTree = await RedBlackTree.new();
    return libCache.RedBlackTree;
  },
  async getPointRedBlackTreeLib() {
    if (libCache.PointRedBlackTree) {
      return libCache.PointRedBlackTree;
    }
    const PointRedBlackTree = Helpers.requireContract('./collections/PointRedBlackTree.sol');
    libCache.PointRedBlackTree = await PointRedBlackTree.new();
    return libCache.PointRedBlackTree;
  },
  async getSegmentRedBlackTreeLib() {
    if (libCache.SegmentRedBlackTree) {
      return libCache.SegmentRedBlackTree;
    }
    const SegmentRedBlackTree = Helpers.requireContract('./collections/SegmentRedBlackTree.sol');
    libCache.SegmentRedBlackTree = await SegmentRedBlackTree.new();
    return libCache.SegmentRedBlackTree;
  },
  async getSweepLineRedBlackTreeLib() {
    if (libCache.SweepLineRedBlackTree) {
      return libCache.SweepLineRedBlackTree;
    }
    const SweepLineRedBlackTree = Helpers.requireContract('./collections/SweepLineRedBlackTree.sol');
    libCache.SweepLineRedBlackTree = await SweepLineRedBlackTree.new();
    return libCache.SweepLineRedBlackTree;
  },
  async getSweepQueueRedBlackTreeLib() {
    if (libCache.SweepQueueRedBlackTree) {
      return libCache.SweepQueueRedBlackTree;
    }
    const SweepQueueRedBlackTree = Helpers.requireContract('./collections/SweepQueueRedBlackTree.sol');
    libCache.SweepQueueRedBlackTree = await SweepQueueRedBlackTree.new();
    return libCache.SweepQueueRedBlackTree;
  },
  async getLinkedListLib() {
    if (libCache.LinkedList) {
      return libCache.LinkedList;
    }
    const LinkedList = Helpers.requireContract('./collections/LinkedList.sol');
    libCache.LinkedList = await LinkedList.new();
    return libCache.LinkedList;
  },
  async getSweepQueueLinkedListLib() {
    if (libCache.SweepQueueLinkedList) {
      return libCache.SweepQueueLinkedList;
    }
    const SweepQueueLinkedList = Helpers.requireContract('./collections/SweepQueueLinkedList.sol');
    SweepQueueLinkedList.link('LinkedList', (await Helpers.getLinkedListLib()).address);
    libCache.SweepQueueLinkedList = await SweepQueueLinkedList.new();
    return libCache.SweepQueueLinkedList;
  },
  async getMartinezRuedaLib() {
    if (libCache.MartinezRueda) {
      return libCache.MartinezRueda;
    }
    const MartinezRueda = Helpers.requireContract('./utils/MartinezRueda.sol');
    MartinezRueda.link('LinkedList', (await Helpers.getLinkedListLib()).address);
    MartinezRueda.link('SweepQueueLinkedList', (await Helpers.getSweepQueueLinkedListLib()).address);
    MartinezRueda.link('RedBlackTree', (await Helpers.getRedBlackTreeLib()).address);
    MartinezRueda.link('SweepLineRedBlackTree', (await Helpers.getSweepLineRedBlackTreeLib()).address);
    libCache.MartinezRueda = await MartinezRueda.new();
    return libCache.MartinezRueda;
  },
  async getWeilerAthertonLib() {
    if (libCache.WeilerAtherton) {
      return libCache.WeilerAtherton;
    }
    const WeilerAtherton = Helpers.requireContract('./utils/WeilerAtherton.sol');
    WeilerAtherton.link('LinkedList', (await Helpers.getLinkedListLib()).address);
    WeilerAtherton.link('SweepQueueLinkedList', (await Helpers.getSweepQueueLinkedListLib()).address);
    WeilerAtherton.link('MartinezRueda', (await Helpers.getMartinezRuedaLib()).address);
    WeilerAtherton.link('PolygonUtils', (await Helpers.getPolygonUtilsLib()).address);
    libCache.WeilerAtherton = await WeilerAtherton.new();
    return libCache.WeilerAtherton;
  },
  async getSplitMergeLib() {
    if (libCache.SplitMergeLib) {
      return libCache.SplitMergeLib;
    }
    const SplitMergeLib = Helpers.requireContract('./SplitMergeLib.sol');
    SplitMergeLib.link('ArrayUtils', (await Helpers.getArrayUtilsLib()).address);
    libCache.SplitMergeLib = await SplitMergeLib.new();
    return libCache.SplitMergeLib;
  },
  async deployGeodesic() {
    const Geodesic = Helpers.requireContract('./Geodesic.sol');

    const landUtils = await Helpers.getLandUtilsLib();
    const polygonUtils = await Helpers.getPolygonUtilsLib();
    Geodesic.link('LandUtils', landUtils.address);
    Geodesic.link('PolygonUtils', polygonUtils.address);
    return Geodesic.new();
  }
};

module.exports = Helpers;
