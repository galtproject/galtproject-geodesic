pragma solidity 0.5.10;

import "../utils/SegmentUtils.sol";


contract MockSegmentUtils {
  event BoolResult(bool result);
  event PointResult(int256[2] result);
  event int8Result (int8 result);

  SegmentUtils.Sweepline sweepline;
  
  constructor() public {
    
  }

  function segmentsIntersect(int256[2][2] memory segment1, int256[2][2] memory segment2) public returns(bool) {
    bool result = SegmentUtils.segmentsIntersect(segment1, segment2);
    emit BoolResult(result);
    return result;
  }

  function findSegmentsIntersection(int256[2][2] memory segment1, int256[2][2] memory segment2) public returns(int256[2] memory) {
    int256[2] memory result = SegmentUtils.findSegmentsIntersection(segment1, segment2);
    emit PointResult(result);
    return result;
  }

  function setSweeplineX(int256 x) public {
    sweepline.x = x;
  }
  
  function setSweeplinePosition(SegmentUtils.Position position) public {
    sweepline.position = position;
  }

  function compareSegments(int256[2][2] memory segment1, int256[2][2] memory segment2) public returns(int8) {
    int8 result = SegmentUtils.compareSegments(sweepline, segment1, segment2);
    emit int8Result(result);
    return result;
  }

  function pointOnSegment(int[2] memory point, int[2] memory sp1, int[2] memory sp2) public returns(bool) {
    bool result = SegmentUtils.pointOnSegment(point, sp1, sp2);
    emit BoolResult(result);
    return result;
  }
}
