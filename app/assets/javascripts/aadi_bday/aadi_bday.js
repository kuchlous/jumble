
var width = 550;
var height = 550;
var pixelSize = 10;
var redPixelSize = 115;
var blanksToBeFilled = [[9, 9], [10, 9], [11, 9], [12, 9], [13, 9], [14, 9], [15, 9], [16, 9], [17, 9], [18, 9], [19, 9], [20, 9], [21, 9], [22, 9], [23, 9], [24, 9], [25, 9], [26, 9], [27, 9], [28, 9], [29, 9], [30, 9], [31, 9], [32, 9], [33, 9], [34, 9], [35, 9], [36, 9], [37, 9], [38, 9], [39, 9], [40, 9], [41, 9], [42, 9], [43, 9], [9, 10], [10, 10], [11, 10], [12, 10], [13, 10], [14, 10], [15, 10], [16, 10], [17, 10], [18, 10], [19, 10], [20, 10], [21, 10], [22, 10], [23, 10], [24, 10], [25, 10], [26, 10], [27, 10], [28, 10], [29, 10], [30, 10], [31, 10], [32, 10], [33, 10], [34, 10], [35, 10], [36, 10], [37, 10], [38, 10], [39, 10], [40, 10], [41, 10], [42, 10], [43, 10], [9, 11], [11, 11], [12, 11], [13, 11], [15, 11], [16, 11], [22, 11], [23, 11], [29, 11], [30, 11], [36, 11], [37, 11], [39, 11], [40, 11], [41, 11], [43, 11], [9, 12], [11, 12], [12, 12], [13, 12], [15, 12], [16, 12], [18, 12], [19, 12], [20, 12], [22, 12], [23, 12], [25, 12], [26, 12], [27, 12], [29, 12], [30, 12], [32, 12], [33, 12], [34, 12], [36, 12], [37, 12], [39, 12], [40, 12], [41, 12], [43, 12], [9, 13], [15, 13], [16, 13], [22, 13], [23, 13], [29, 13], [30, 13], [36, 13], [37, 13], [43, 13], [9, 14], [11, 14], [12, 14], [13, 14], [15, 14], [16, 14], [18, 14], [19, 14], [20, 14], [22, 14], [23, 14], [25, 14], [26, 14], [27, 14], [28, 14], [29, 14], [30, 14], [32, 14], [33, 14], [34, 14], [35, 14], [36, 14], [37, 14], [38, 14], [39, 14], [41, 14], [42, 14], [43, 14], [9, 15], [11, 15], [12, 15], [13, 15], [15, 15], [16, 15], [18, 15], [19, 15], [20, 15], [22, 15], [23, 15], [25, 15], [26, 15], [27, 15], [28, 15], [29, 15], [30, 15], [32, 15], [33, 15], [34, 15], [35, 15], [36, 15], [37, 15], [38, 15], [39, 15], [41, 15], [42, 15], [43, 15], [9, 16], [10, 16], [11, 16], [12, 16], [13, 16], [14, 16], [15, 16], [16, 16], [17, 16], [18, 16], [19, 16], [20, 16], [21, 16], [22, 16], [23, 16], [24, 16], [25, 16], [26, 16], [27, 16], [28, 16], [29, 16], [30, 16], [31, 16], [32, 16], [33, 16], [34, 16], [35, 16], [36, 16], [37, 16], [38, 16], [39, 16], [40, 16], [41, 16], [42, 16], [43, 16], [9, 17], [10, 17], [11, 17], [12, 17], [13, 17], [14, 17], [15, 17], [16, 17], [17, 17], [18, 17], [19, 17], [20, 17], [21, 17], [22, 17], [23, 17], [24, 17], [25, 17], [26, 17], [27, 17], [28, 17], [29, 17], [30, 17], [31, 17], [32, 17], [33, 17], [34, 17], [35, 17], [36, 17], [37, 17], [38, 17], [39, 17], [40, 17], [41, 17], [42, 17], [43, 17], [9, 18], [10, 18], [11, 18], [12, 18], [13, 18], [14, 18], [15, 18], [16, 18], [17, 18], [18, 18], [19, 18], [20, 18], [21, 18], [22, 18], [23, 18], [24, 18], [25, 18], [26, 18], [27, 18], [28, 18], [29, 18], [30, 18], [31, 18], [32, 18], [33, 18], [34, 18], [35, 18], [36, 18], [37, 18], [38, 18], [39, 18], [40, 18], [41, 18], [42, 18], [43, 18], [9, 19], [10, 19], [11, 19], [12, 19], [13, 19], [14, 19], [15, 19], [16, 19], [17, 19], [18, 19], [19, 19], [20, 19], [21, 19], [22, 19], [23, 19], [24, 19], [25, 19], [26, 19], [27, 19], [28, 19], [29, 19], [30, 19], [31, 19], [32, 19], [33, 19], [34, 19], [35, 19], [36, 19], [37, 19], [38, 19], [39, 19], [40, 19], [41, 19], [42, 19], [43, 19], [9, 20], [10, 20], [11, 20], [12, 20], [13, 20], [14, 20], [15, 20], [16, 20], [17, 20], [18, 20], [19, 20], [20, 20], [21, 20], [22, 20], [23, 20], [24, 20], [25, 20], [26, 20], [27, 20], [28, 20], [29, 20], [30, 20], [31, 20], [32, 20], [33, 20], [34, 20], [35, 20], [36, 20], [37, 20], [38, 20], [39, 20], [40, 20], [41, 20], [42, 20], [43, 20], [9, 21], [10, 21], [11, 21], [12, 21], [13, 21], [14, 21], [15, 21], [16, 21], [17, 21], [18, 21], [19, 21], [20, 21], [21, 21], [22, 21], [23, 21], [24, 21], [25, 21], [26, 21], [27, 21], [28, 21], [29, 21], [30, 21], [31, 21], [32, 21], [33, 21], [34, 21], [35, 21], [36, 21], [37, 21], [38, 21], [39, 21], [40, 21], [41, 21], [42, 21], [43, 21], [9, 22], [10, 22], [11, 22], [12, 22], [13, 22], [14, 22], [15, 22], [16, 22], [17, 22], [18, 22], [19, 22], [20, 22], [21, 22], [22, 22], [23, 22], [24, 22], [25, 22], [26, 22], [27, 22], [28, 22], [29, 22], [30, 22], [31, 22], [32, 22], [33, 22], [34, 22], [35, 22], [36, 22], [37, 22], [38, 22], [39, 22], [40, 22], [41, 22], [42, 22], [43, 22], [9, 23], [10, 23], [11, 23], [12, 23], [13, 23], [14, 23], [15, 23], [16, 23], [17, 23], [18, 23], [19, 23], [20, 23], [21, 23], [22, 23], [23, 23], [24, 23], [25, 23], [26, 23], [27, 23], [28, 23], [29, 23], [30, 23], [31, 23], [32, 23], [33, 23], [34, 23], [35, 23], [36, 23], [37, 23], [38, 23], [39, 23], [40, 23], [41, 23], [42, 23], [43, 23], [9, 24], [10, 24], [11, 24], [12, 24], [17, 24], [18, 24], [19, 24], [24, 24], [25, 24], [26, 24], [32, 24], [33, 24], [35, 24], [36, 24], [37, 24], [39, 24], [40, 24], [41, 24], [42, 24], [43, 24], [9, 25], [10, 25], [11, 25], [12, 25], [14, 25], [15, 25], [17, 25], [18, 25], [19, 25], [21, 25], [22, 25], [23, 25], [25, 25], [26, 25], [28, 25], [29, 25], [30, 25], [32, 25], [33, 25], [35, 25], [36, 25], [37, 25], [39, 25], [40, 25], [41, 25], [42, 25], [43, 25], [9, 26], [10, 26], [11, 26], [12, 26], [18, 26], [19, 26], [21, 26], [22, 26], [23, 26], [25, 26], [26, 26], [32, 26], [33, 26], [39, 26], [40, 26], [41, 26], [42, 26], [43, 26], [9, 27], [10, 27], [11, 27], [12, 27], [14, 27], [15, 27], [16, 27], [18, 27], [19, 27], [21, 27], [22, 27], [23, 27], [25, 27], [26, 27], [28, 27], [29, 27], [30, 27], [32, 27], [33, 27], [34, 27], [35, 27], [37, 27], [38, 27], [39, 27], [40, 27], [41, 27], [42, 27], [43, 27], [9, 28], [10, 28], [11, 28], [12, 28], [18, 28], [19, 28], [24, 28], [25, 28], [26, 28], [28, 28], [29, 28], [30, 28], [32, 28], [33, 28], [34, 28], [35, 28], [37, 28], [38, 28], [39, 28], [40, 28], [41, 28], [42, 28], [43, 28], [9, 29], [10, 29], [11, 29], [12, 29], [13, 29], [14, 29], [15, 29], [16, 29], [17, 29], [18, 29], [19, 29], [20, 29], [21, 29], [22, 29], [23, 29], [24, 29], [25, 29], [26, 29], [27, 29], [28, 29], [29, 29], [30, 29], [31, 29], [32, 29], [33, 29], [34, 29], [35, 29], [36, 29], [37, 29], [38, 29], [39, 29], [40, 29], [41, 29], [42, 29], [43, 29], [9, 30], [10, 30], [11, 30], [12, 30], [13, 30], [14, 30], [15, 30], [16, 30], [17, 30], [18, 30], [19, 30], [20, 30], [21, 30], [22, 30], [23, 30], [24, 30], [25, 30], [26, 30], [27, 30], [28, 30], [29, 30], [30, 30], [31, 30], [32, 30], [33, 30], [34, 30], [35, 30], [36, 30], [37, 30], [38, 30], [39, 30], [40, 30], [41, 30], [42, 30], [43, 30], [9, 31], [10, 31], [11, 31], [12, 31], [13, 31], [14, 31], [15, 31], [16, 31], [17, 31], [18, 31], [19, 31], [20, 31], [21, 31], [22, 31], [23, 31], [24, 31], [25, 31], [26, 31], [27, 31], [28, 31], [29, 31], [30, 31], [31, 31], [32, 31], [33, 31], [34, 31], [35, 31], [36, 31], [37, 31], [38, 31], [39, 31], [40, 31], [41, 31], [42, 31], [43, 31], [9, 32], [10, 32], [11, 32], [12, 32], [13, 32], [14, 32], [15, 32], [16, 32], [17, 32], [18, 32], [19, 32], [20, 32], [21, 32], [22, 32], [23, 32], [24, 32], [25, 32], [26, 32], [27, 32], [28, 32], [29, 32], [30, 32], [31, 32], [32, 32], [33, 32], [34, 32], [35, 32], [36, 32], [37, 32], [38, 32], [39, 32], [40, 32], [41, 32], [42, 32], [43, 32], [9, 33], [10, 33], [11, 33], [12, 33], [13, 33], [14, 33], [15, 33], [16, 33], [17, 33], [18, 33], [19, 33], [20, 33], [21, 33], [22, 33], [23, 33], [24, 33], [25, 33], [26, 33], [27, 33], [28, 33], [29, 33], [30, 33], [31, 33], [32, 33], [33, 33], [34, 33], [35, 33], [36, 33], [37, 33], [38, 33], [39, 33], [40, 33], [41, 33], [42, 33], [43, 33], [9, 34], [10, 34], [11, 34], [12, 34], [13, 34], [14, 34], [15, 34], [16, 34], [17, 34], [18, 34], [19, 34], [20, 34], [21, 34], [22, 34], [23, 34], [24, 34], [25, 34], [26, 34], [27, 34], [28, 34], [29, 34], [30, 34], [31, 34], [32, 34], [33, 34], [34, 34], [35, 34], [36, 34], [37, 34], [38, 34], [39, 34], [40, 34], [41, 34], [42, 34], [43, 34], [9, 35], [10, 35], [11, 35], [12, 35], [13, 35], [14, 35], [15, 35], [16, 35], [17, 35], [18, 35], [19, 35], [20, 35], [21, 35], [22, 35], [23, 35], [24, 35], [25, 35], [26, 35], [27, 35], [28, 35], [29, 35], [30, 35], [31, 35], [32, 35], [33, 35], [34, 35], [35, 35], [36, 35], [37, 35], [38, 35], [39, 35], [40, 35], [41, 35], [42, 35], [43, 35], [9, 36], [10, 36], [11, 36], [12, 36], [13, 36], [14, 36], [15, 36], [16, 36], [17, 36], [18, 36], [19, 36], [20, 36], [21, 36], [22, 36], [23, 36], [24, 36], [25, 36], [26, 36], [27, 36], [28, 36], [29, 36], [30, 36], [31, 36], [32, 36], [33, 36], [34, 36], [35, 36], [36, 36], [37, 36], [38, 36], [39, 36], [40, 36], [41, 36], [42, 36], [43, 36], [9, 37], [10, 37], [11, 37], [12, 37], [18, 37], [19, 37], [25, 37], [26, 37], [31, 37], [32, 37], [33, 37], [39, 37], [40, 37], [41, 37], [42, 37], [43, 37], [9, 38], [10, 38], [11, 38], [12, 38], [14, 38], [15, 38], [16, 38], [18, 38], [19, 38], [21, 38], [22, 38], [23, 38], [25, 38], [26, 38], [28, 38], [29, 38], [30, 38], [32, 38], [33, 38], [34, 38], [35, 38], [37, 38], [38, 38], [39, 38], [40, 38], [41, 38], [42, 38], [43, 38], [9, 39], [10, 39], [11, 39], [12, 39], [18, 39], [19, 39], [25, 39], [26, 39], [28, 39], [29, 39], [30, 39], [32, 39], [33, 39], [34, 39], [35, 39], [37, 39], [38, 39], [39, 39], [40, 39], [41, 39], [42, 39], [43, 39], [9, 40], [10, 40], [11, 40], [12, 40], [14, 40], [15, 40], [16, 40], [18, 40], [19, 40], [21, 40], [22, 40], [23, 40], [25, 40], [26, 40], [28, 40], [29, 40], [30, 40], [32, 40], [33, 40], [34, 40], [35, 40], [37, 40], [38, 40], [39, 40], [40, 40], [41, 40], [42, 40], [43, 40], [9, 41], [10, 41], [11, 41], [12, 41], [14, 41], [15, 41], [16, 41], [18, 41], [19, 41], [21, 41], [22, 41], [23, 41], [25, 41], [26, 41], [31, 41], [32, 41], [33, 41], [39, 41], [40, 41], [41, 41], [42, 41], [43, 41], [9, 42], [10, 42], [11, 42], [12, 42], [13, 42], [14, 42], [15, 42], [16, 42], [17, 42], [18, 42], [19, 42], [20, 42], [21, 42], [22, 42], [23, 42], [24, 42], [25, 42], [26, 42], [27, 42], [28, 42], [29, 42], [30, 42], [31, 42], [32, 42], [33, 42], [34, 42], [35, 42], [36, 42], [37, 42], [38, 42], [39, 42], [40, 42], [41, 42], [42, 42], [43, 42], [9, 43], [10, 43], [11, 43], [12, 43], [13, 43], [14, 43], [15, 43], [16, 43], [17, 43], [18, 43], [19, 43], [20, 43], [21, 43], [22, 43], [23, 43], [24, 43], [25, 43], [26, 43], [27, 43], [28, 43], [29, 43], [30, 43], [31, 43], [32, 43], [33, 43], [34, 43], [35, 43], [36, 43], [37, 43], [38, 43], [39, 43], [40, 43], [41, 43], [42, 43], [43, 43]]; 
var redCircleCount;

var redCircleCenters = [];

function initRedCircles() {
  redCircleCenters.push([redPixelSize/2, redPixelSize/2]);  // Top-Left
  redCircleCenters.push([width - redPixelSize/2, height - redPixelSize/2]);  // Bottom-Right
  redCircleCenters.push([redPixelSize/2, height - redPixelSize/2]);  // Top-Left
  redCircleCenters.push([width - redPixelSize/2, redPixelSize/2]);  // Top-Left


  /*
  var w_circles = (width/redPixelSize);
  var h_circles = (height/redPixelSize);
  for (var i = 0; i < w_circles; i++) {
    redCircleCenters.push([i*redPixelSize + redPixelSize/2, redPixelSize/2]);
    redCircleCenters.push([i*redPixelSize + redPixelSize/2, height-redPixelSize/2]);
  }
  for (var i = 0; i < h_circles; i++) {
    redCircleCenters.push([redPixelSize/2, i*redPixelSize + redPixelSize/2]);
    redCircleCenters.push([width-redPixelSize/2, i*redPixelSize + redPixelSize/2]);
  }
  */
  svg.selectAll("circle").data(redCircleCenters).enter()
                         .append("circle")
                         .attr("cx", fx)
                         .attr("cy", fy)
                         .attr("r", redPixelSize/2);

  return redCircleCenters.length;
}

var blanksQueue = 
{ 
  "pQ": shuffle(blanksToBeFilled.map(indexToPixelCoords)),
  "next": function() { 
    if (blanksQueue.pQ.length == 0) { 
      blanksQueue.pQ = shuffle(blanksToBeFilled);
    }
    var blank = blanksQueue.pQ.pop(); 
    return blank;
  },
  "size": function() { return blanksQueue.pQ.length; },
  "enqueue": function(pxs) { blanksQueue.pQ = shuffle(blanksQueue.pQ.concat(pxs)); }
}

blanksToBeFilled = shuffle(blanksToBeFilled.map(indexToPixelCoords));

function fx(datum) {
  return datum[0] + "px";
}

function fy(datum) {
  return datum[1] + "px";
}

function shuffle(a) {
  var reps = a.length;
  for (i = 0; i <= reps; i++) {
    var r1 = Math.floor(Math.random()*reps);
    var r2 = Math.floor(Math.random()*reps);
    var temp = a[r1];
    a[r1] = a[r2];
    a[r2] = temp;
  }
  return(a);	
}

function indexToPixelCoords(xy) {
  return [(xy[0] - 2 + 3)*pixelSize, (xy[1] - 2 + 3)*pixelSize];
}

var svg = d3.select("#container").select("svg");

var colors = ["redpixel", "greenpixel", "yellowpixel"];

function installMouseClickHandler(pxClass) {
  svg.selectAll("circle")
    .on("click", function() {
        var numReplacements = blanksQueue.size() / redCircleCount;
        var newCircles = [];
        for (var i=1; i<numReplacements; i++) {
          var newCircle = svg.append("circle")
                          .attr("cx", this.cx.baseVal.value)
                          .attr("cy", this.cy.baseVal.value)
                          .attr("r", this.r.baseVal.value);
          newCircles.push(newCircle);
        }
        var sound_file_url = "/assets/audios/firecrackers-0" + redCircleCount + ".wav";
        d3.select('#firecracker').html(
          "<embed src='"+sound_file_url+"' hidden=true autostart=true loop=false>");
        var destination = blanksQueue.next();
        d3.select(this).transition()
          .attr("cx", destination[0])
          .attr("cy", destination[1])
          .attr("r", pixelSize/2)
          .attr("class", colors[Math.floor(Math.random()*3)])
          .duration(750)
          .ease();
        for (var i=0; i<newCircles.length; i++) {
          var destination = blanksQueue.next();
          var newCircle = newCircles[i];
          newCircle.transition()
            .attr("cx", destination[0])
            .attr("cy", destination[1])
            .attr("r", pixelSize/2)
            .attr("class", colors[Math.floor(Math.random()*3)])
            .duration(750)
            .ease();
        }
        // this.on("click", null);
        redCircleCount -= 1;
        if (redCircleCount == 0) {fadeInMessage() };
      });
}

function fadeInMessage() {
  d3.select("div#container")
     .transition()
     .style("opacity", 0.0)
     .duration(5000)
     .delay(5000);
  var sound_file_url = "/assets/audios/firecrackers-05.wav";
  d3.select('#firecracker').html(
          "<embed src='"+sound_file_url+"' hidden=true autostart=true loop=true>");

  d3.select("p#instructions")
    .html('Have A Great Birthday In Singapore');
  d3.select("p#instructions")
     .transition()
     .style("font", "100px Helvetica, arial, sans-serif")
     .duration(10000)
     .delay(5000);
}

redCircleCount = initRedCircles();

installMouseClickHandler("circle");









