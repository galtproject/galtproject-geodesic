pragma solidity ^0.5.13;

import "../utils/CPointUtils.sol";


library CPointUtilsPublic {

  // LAT/LON/HEIGHT

  function cPointToLat(uint256 _cPoint) public pure returns (int256) {
    return CPointUtils.cPointToLat(_cPoint);
  }

  function cPointToLon(uint256 _cPoint) public pure returns (int256) {
    return CPointUtils.cPointToLon(_cPoint);
  }

  function cPointToHeight(uint256 _cPoint) public pure returns (int256) {
    return CPointUtils.cPointToHeight(_cPoint);
  }

  // COMBINATIONS

  function cPointToLatLonHeight(uint256 _cPoint) public pure returns (int256 lat, int256 lon, int256 height) {
    return CPointUtils.cPointToLatLonHeight(_cPoint);
  }

  function cPointToLatLonArr(uint256 _cPoint) public pure returns (int256[2] memory) {
    return CPointUtils.cPointToLatLonArr(_cPoint);
  }

  function cPointToLatLon(uint256 _cPoint) public pure returns (int256 lat, int256 lon) {
    return CPointUtils.cPointToLatLon(_cPoint);
  }

  function latLonHeightToCPoint(int256 _lat, int256 _lon, int256 _height) public pure returns (uint256 cPoint) {
    return CPointUtils.latLonHeightToCPoint(_lat, _lon, _height);
  }
}
