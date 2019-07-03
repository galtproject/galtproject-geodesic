pragma solidity 0.5.10;

import "../utils/LandUtils.sol";
import "../utils/PolygonUtils.sol";


contract MockPolygonUtils {
  event LogAreaResult(uint256 result);
  
  PolygonUtils.UtmPolygon polygon;
  
  constructor() public {

  }
  
  event UtmPoint(int[3] point);
  event UtmDataToSave(int scale, int zone, int isNorth);
  event ConvertedUtm(bool isNorth, int zone, int latBand);
  
  function addPoint(int256[2] memory point) public {
    polygon.points.push(LandUtils.latLonToUtmCompressed(point[0], point[1]));
    emit UtmPoint(polygon.points[polygon.points.length - 1]);
  }
  
  function getArea() public returns(uint256 area) {
    area = PolygonUtils.getUtmArea(polygon);
    emit LogAreaResult(area);
  }
}
