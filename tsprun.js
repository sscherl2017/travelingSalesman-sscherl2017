/** 
 * This class can do several heuristics on a set of points, smallest increase, nearest neighbor and greedy. It also does
 * not need a CSS file. You can either click on the first canvas to add points or add random points through the console.
 * @author Sam Scherl
 * @version 2/29/16
 */

var arrayX = [];
var arrayY = [];

var smallestIncreaseX = [];
var smallestIncreaseY = [];

var nearestNeighborX = [];
var nearestNeighborY = [];

var greedyX = [];
var greedyY = [];

/*
* Takes in any points that are clicked on in the first canvas and puts them on all the canvases
* and adds all of the points to the two arrays.
*/
$(document).ready( function() {
	$("#canvas").click( function() {
	
	//get context of canvas
	var canvas = $("#canvas").get(0);
	var ctx = canvas.getContext("2d");
	
	var canvas2 = $("#canvas2").get(0);
	var ctx2 = canvas2.getContext("2d");
	
	var canvas3 = $("#canvas3").get(0);
	var ctx3 = canvas3.getContext("2d");
	
	var x = event.pageX - canvas.offsetLeft;
	var y = event.pageY - canvas.offsetTop;
	
	arrayX.push(x);
	arrayY.push(y);
	
	var pixelSize = 2;
	ctx.fillRect(x,y,pixelSize,pixelSize);
	ctx2.fillRect(x,y,pixelSize,pixelSize);
	ctx3.fillRect(x,y,pixelSize,pixelSize);
	
	});
});

/**
* Puts a given number of random points on the canvases and adds all of the points
* to the two arrays.
* @param numPoints	The number of points to be added the canvases
*/
function populateRandom(numPoints)
{
	var canvas = $("#canvas").get(0);
	var ctx = canvas.getContext("2d");
	
	var canvas2 = $("#canvas2").get(0);
	var ctx2 = canvas2.getContext("2d");
	
	var canvas3 = $("#canvas3").get(0);
	var ctx3 = canvas3.getContext("2d");
	
	for (i = 0; i < numPoints; i++)
	{
		var x = Math.round(281 * Math.random()) + 10;
		var y = Math.round(131 * Math.random()) + 10;
		
		arrayX.push(x);
		arrayY.push(y);
		
		var pixelSize = 2;
		ctx.fillRect(x,y,pixelSize,pixelSize);
		ctx2.fillRect(x,y,pixelSize,pixelSize);
		ctx3.fillRect(x,y,pixelSize,pixelSize);
	}
}

/**
* Executes the smallest increase heuristic by finding out where a point can be added to minimizes
* the increase to the tour length.
*/
function smallestIncrease()
{
	smallestIncreaseX.push(arrayX[0]);
	smallestIncreaseY.push(arrayY[0]);
	for (i = 1; i < arrayX.length; i++)
	{	
		var leastIndex = -1;
		var smallestIncrease = Number.MAX_SAFE_INTEGER;
		for (j = 1; j < smallestIncreaseX.length + 1; j++)
		{
			if (j == smallestIncreaseX.length)
			{
				if (distance(arrayX[i], arrayY[i], smallestIncreaseX[j - 1], smallestIncreaseY[j - 1]) < smallestIncrease)
				{
					smallestIncrease = distance(arrayX[i], arrayY[i], smallestIncreaseX[j - 1], smallestIncreaseY[j - 1]);
					leastIndex = j;
				}
			}
			else
			{
				var newIncrease = distance(arrayX[i], arrayY[i], smallestIncreaseX[j - 1], smallestIncreaseY[j - 1]) + distance(arrayX[i], arrayY[i], smallestIncreaseX[j], smallestIncreaseY[j]) - distance(smallestIncreaseX[j - 1], smallestIncreaseY[j - 1], smallestIncreaseX[j], smallestIncreaseY[j]);
				if (newIncrease < smallestIncrease)
				{
					smallestIncrease = newIncrease;
					leastIndex = j;
				}
			}
		}
		smallestIncreaseX.splice(leastIndex, 0, arrayX[i]);	
		smallestIncreaseY.splice(leastIndex, 0, arrayY[i]);	
	}
	nearestNeighbor();
}

/**
* Executes the nearest neighbor heuristic by finding the closest point to the next point that is already in
* the tour and adding the next point after the closest point to the next point.
*/
function nearestNeighbor()
{
	nearestNeighborX.push(arrayX[0]);
	nearestNeighborY.push(arrayY[0]);
	for (i = 1; i < arrayX.length; i++)
	{
		var least = Number.MAX_SAFE_INTEGER;;
		var leastIndex = -1;
		for (j = 1; j < nearestNeighborX.length + 1; j++)
		{	
			if (distance(nearestNeighborX[j - 1], nearestNeighborY[j - 1], arrayX[i], arrayY[i]) < least)
			{
				least = distance(nearestNeighborX[j - 1], nearestNeighborY[j - 1], arrayX[i], arrayY[i]);
				leastIndex = j;
			}
		}
		nearestNeighborX.splice(leastIndex, 0, arrayX[i]);
		nearestNeighborY.splice(leastIndex, 0, arrayY[i]);	
	}
	greedy();
}

/**
* Executes the "pure" greedy heuristic by finding the point closest to the last point in the tour and adding the closest
* point to the end of the tour.
*/
function greedy()
{
	var allX = arrayX.slice();
	var allY = arrayY.slice();
	greedyX = allX.splice(0, 1);
	greedyY = allY.splice(0, 1);
	for (i = 0; i < greedyX.length; i++)
	{
		var least = Number.MAX_SAFE_INTEGER;;
		var leastIndex = -1;
		for (j = 0; j < allX.length; j++)
		{
			if (distance(greedyX[i], greedyY[i], allX[j], allY[j]) < least)
			{
				least = distance(greedyX[i], greedyY[i], allX[j], allY[j]);
				leastIndex = j;
			}
		}
		if (leastIndex != -1)
		{
			greedyX.push(allX[leastIndex]);
			allX.splice(leastIndex, 1);
			greedyY.push(allY[leastIndex]);
			allY.splice(leastIndex, 1);
		}
	}
	draw()
}

/**
* Connects all the points on all the canvases in the order dictated by their heuristic.
*/
function draw()
{
	var canvas = $('#canvas').get(0);
	var ctx = canvas.getContext("2d");
	ctx.beginPath();
	for (i = 0; i < smallestIncreaseX.length - 1; i++)
	{
		ctx.moveTo(smallestIncreaseX[i], smallestIncreaseY[i]);
		ctx.lineTo(smallestIncreaseX[i + 1], smallestIncreaseY[i + 1]);
	}
	ctx.stroke();
	
	
	var canvas2 = $('#canvas2').get(0);
	var ctx2 = canvas2.getContext("2d");
	ctx2.beginPath();
	for (i = 0; i < nearestNeighborX.length - 1; i++)
	{
		ctx2.moveTo(nearestNeighborX[i], nearestNeighborY[i]);
		ctx2.lineTo(nearestNeighborX[i + 1], nearestNeighborY[i + 1]);
	}
	ctx2.stroke();
	
	var canvas3 = $('#canvas3').get(0);
	var ctx3 = canvas3.getContext("2d");
	ctx3.beginPath();
	for (i = 0; i < greedyX.length - 1; i++)
	{
		ctx3.moveTo(greedyX[i], greedyY[i]);
		ctx3.lineTo(greedyX[i + 1], greedyY[i + 1]);
	}
	ctx3.stroke();
	
	var theDiv = document.getElementById('smallestIncrease');
	theDiv.appendChild(document.createTextNode(totalSmallestIncrease()));
	
	var theDiv2 = document.getElementById('nearestNeighbor');
	theDiv2.appendChild(document.createTextNode(totalNearestNeighbor()));
	
	var theDiv3 = document.getElementById('greedy');
	theDiv3.appendChild(document.createTextNode(totalGreedy()));
}

/**
* Returns the distance between two points.
*/
function distance(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
* Returns the total tour length of the smallest increase heuristic.
*/
function totalSmallestIncrease()
{
	var sum = 0;
	for (i = 0; i < smallestIncreaseX.length - 1; i++)
		sum += distance(smallestIncreaseX[i], smallestIncreaseY[i], smallestIncreaseX[i +1], smallestIncreaseY[i + 1]);
	return Math.round(sum * 100)/100;
}

/**
* Returns the total tour length of the nearest neighbor heuristic.
*/
function totalNearestNeighbor()
{
	var sum = 0;
	for (i = 0; i < nearestNeighborX.length - 1; i++)
		sum += distance(nearestNeighborX[i], nearestNeighborY[i], nearestNeighborX[i +1], nearestNeighborY[i + 1]);
	return Math.round(sum * 100)/100;
}

/**
* Returns the total tour length of the "pure" greedy heuristic.
*/
function totalGreedy()
{
	var sum = 0;
	for (i = 0; i < greedyX.length - 1; i++)
		sum += distance(greedyX[i], greedyY[i], greedyX[i +1], greedyY[i + 1]);
	return Math.round(sum * 100)/100;
}