var populationOfPersons = [];
var Person = /** @class */ (function () {
    function Person(isInfected, daysUntilHealed) {
        if (isInfected) {
            this.tryInfect(daysUntilHealed);
        }
        this.isImmune = false;
    }
    Person.prototype.tryInfect = function (daysInfectious) {
        if (!this.isImmune && !this.isInfected) {
            this.isInfected = true;
            this.daysUntilHealed = daysInfectious;
        }
    };
    Person.prototype.progressDisease = function () {
        if (this.isInfected) {
            this.daysUntilHealed--;
            if (this.daysUntilHealed < 1) {
                this.isInfected = false;
                this.isImmune = true;
            }
        }
    };
    Person.prototype.toString = function () {
        return this.isInfected + "";
    };
    return Person;
}());
//SELECTORS
var canvas = function () { return document.getElementById('populationCanvas'); };
var populationSize = function () { return parseInt(document.getElementById('population').value); };
var infectedSize = function () { return parseInt(document.getElementById('numberInfected').value); };
var daysInfectious = function () { return parseInt(document.getElementById('daysInfectious').value); };
var infectOtherCount = function () { return parseInt(document.getElementById('infectOtherCount').value); };
var stepNrElement = function () { return document.getElementById('stepNr'); };
//LOGIC
var render = function (canvas, persons) {
    var sizeElement = document.getElementById('pixels');
    var selectedOption = sizeElement.selectedOptions.item(0);
    var personSize = parseInt(selectedOption.value);
    var start = new Date().getTime();
    var squareSize = Math.ceil(Math.sqrt(persons.length));
    canvas.width = squareSize * personSize;
    canvas.height = squareSize * personSize;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var k = 0; k < persons.length; k++) {
        if (persons[k].isInfected) {
            ctx.fillStyle = "#721c24";
        }
        else if (persons[k].isImmune) {
            ctx.fillStyle = "#004085";
        }
        else {
            ctx.fillStyle = "#155724";
        }
        ctx.fillRect(Math.floor(k % squareSize) * personSize, Math.floor(k / squareSize) * personSize, personSize, personSize);
    }
    var end = new Date().getTime();
    console.log("Performance " + (end - start));
};
var initializePopulation = function (populationOfPersons, numberPeople, infectedSize, daysUntilHealed) {
    populationOfPersons.length = 0;
    for (var i = 0; i < infectedSize; i++) {
        populationOfPersons.push(new Person(true, daysUntilHealed));
    }
    while (populationOfPersons.length < numberPeople) {
        populationOfPersons.push(new Person(false, daysUntilHealed));
    }
    return populationOfPersons;
};
var infectOthers = function (infectOtherCount, daysInfectious) {
    var infected = populationOfPersons.filter(function (s) { return s.isInfected === true; });
    infected.forEach(function (infected) { return infected.progressDisease(); });
    for (var k = 0; k < infected.length; k++) {
        for (var z = 0; z < infectOtherCount; z++) {
            var index = Math.round(Math.random() * (populationOfPersons.length - 1));
            var p = populationOfPersons[index];
            p.tryInfect(daysInfectious);
        }
    }
};
var hideElements = function () {
    var initbtn = document.getElementById('initbtn');
    initbtn.disabled = true;
    var stepbtn = document.getElementById('stepbtn');
    stepbtn.disabled = true;
    var calculating = document.getElementById('calculating');
    calculating.style.display = 'block';
};
var showElements = function () {
    var initbtn = document.getElementById('initbtn');
    initbtn.disabled = false;
    var stepbtn = document.getElementById('stepbtn');
    stepbtn.disabled = false;
    var calculating = document.getElementById('calculating');
    calculating.style.display = 'none';
};
var init = function () {
    hideElements();
    initializePopulation(populationOfPersons, populationSize(), infectedSize(), daysInfectious());
    render(canvas(), populationOfPersons);
    showElements();
};
var simulate = function () {
    hideElements();
    var stepNrEl = stepNrElement();
    stepNrEl.value = (parseInt(stepNrEl.value) + 1) + "";
    infectOthers(infectOtherCount(), daysInfectious());
    render(canvas(), populationOfPersons);
    showElements();
};
