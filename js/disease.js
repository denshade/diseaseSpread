var populationOfPersons = [];
var Person = /** @class */ (function () {
    function Person(isInfected) {
        this.isInfected = isInfected;
    }
    Person.prototype.tryInfect = function () {
        this.isInfected = true;
    };
    Person.prototype.toString = function () {
        return this.isInfected + "";
    };
    return Person;
}());
var render = function (canvas, persons) {
    var start = new Date().getTime();
    var squareSize = Math.ceil(Math.sqrt(persons.length));
    canvas.width = squareSize;
    canvas.height = squareSize;
    var ctx = canvas.getContext('2d');
    var myImageData = ctx.createImageData(squareSize, squareSize);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, squareSize, squareSize);
    //433
    for (var k = 0; k < persons.length; k++) {
        if (persons[k].isInfected) {
            ctx.fillStyle = "red";
        }
        else {
            ctx.fillStyle = "green";
        }
        ctx.fillRect(k % squareSize, k / squareSize, 1, 1);
    }
    //460
    /*    persons.forEach((value, index)=> {
          if (value.isInfected) {
                ctx.fillStyle = "red";
            } else {
                ctx.fillStyle = "green";
            }
            ctx.fillRect(index % squareSize,index / squareSize,1, 1);
        })*/
    var end = new Date().getTime();
    console.log("Performance " + (end - start));
};
var initializePopulation = function (populationOfPersons, numberPeople, infectedSize) {
    populationOfPersons.length = 0;
    for (var i = 0; i < infectedSize; i++) {
        populationOfPersons.push(new Person(true));
    }
    while (populationOfPersons.length < numberPeople) {
        populationOfPersons.push(new Person(false));
    }
    return populationOfPersons;
};
var infectOthers = function (infectOtherCount) {
    var infected = populationOfPersons.filter(function (s) { return s.isInfected; });
    for (var k = 0; k < infected.length; k++) {
        for (var z = 0; z < infectOtherCount; z++) {
            var index = Math.round(Math.random() * (populationOfPersons.length - 1));
            var p = populationOfPersons[index];
            p.tryInfect();
        }
    }
};
var init = function () {
    var canvas = document.getElementById('populationCanvas');
    var populationString = document.getElementById('population').value;
    var populationSize = parseInt(populationString);
    var infectedString = document.getElementById('numberInfected').value;
    var infectedSize = parseInt(infectedString);
    initializePopulation(populationOfPersons, populationSize, infectedSize);
    render(canvas, populationOfPersons);
};
var simulate = function () {
    var canvas = document.getElementById('populationCanvas');
    var infectOtherCountStr = document.getElementById('infectOtherCount').value;
    var infectOtherCount = parseInt(infectOtherCountStr);
    infectOthers(infectOtherCount);
    render(canvas, populationOfPersons);
};
