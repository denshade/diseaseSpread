const populationOfPersons = [];

class Person
{
    isInfected : boolean;

    constructor(isInfected:boolean)
    {
        this.isInfected = isInfected;
    }

    public tryInfect()
    {
        this.isInfected = true;
    }

    public toString() : string
    {
        return this.isInfected + "";
    }
}

const render = (canvas: HTMLCanvasElement, persons : Person[]) =>
{
    var start = new Date().getTime();

    const squareSize : number =  Math.ceil(Math.sqrt(persons.length));
    canvas.width = squareSize;
    canvas.height = squareSize;
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
    var myImageData = ctx.createImageData(squareSize, squareSize);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, squareSize, squareSize);
    //433
    for (let k = 0; k < persons.length; k++ ) {
        if (persons[k].isInfected) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "green";
        }
        ctx.fillRect(k % squareSize,k / squareSize,1, 1);
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
    console.log("Performance " + (end-start));
}

const initializePopulation = (populationOfPersons: Person[], numberPeople : number, infectedSize : number) : Person[] =>
{
    populationOfPersons.length = 0;
    for (let i = 0; i < infectedSize; i++)
    {
        populationOfPersons.push(new Person(true));
    }
    while(populationOfPersons.length < numberPeople)
    {
        populationOfPersons.push(new Person(false));
    }
    return populationOfPersons;
}

const infectOthers = (infectOtherCount) => {
    const infected = populationOfPersons.filter(s => s.isInfected);
    for (let k = 0; k < infected.length; k++)
    {
        for (let z = 0; z < infectOtherCount; z++)
        {
            const index = Math.round(Math.random() * (populationOfPersons.length - 1));
            let p: Person = populationOfPersons[index];
            p.tryInfect();
        }
    }
}

const init = () => {
    const canvas = <HTMLCanvasElement>document.getElementById('populationCanvas');
    const populationString = (<HTMLInputElement>document.getElementById('population')).value;
    const populationSize : number = parseInt(populationString);
    const infectedString = (<HTMLInputElement>document.getElementById('numberInfected')).value;
    const infectedSize : number = parseInt(infectedString);
    initializePopulation(populationOfPersons, populationSize, infectedSize);
    render(canvas, populationOfPersons)
}

const simulate = () => {
    const canvas = <HTMLCanvasElement>document.getElementById('populationCanvas');
    const infectOtherCountStr = (<HTMLInputElement>document.getElementById('infectOtherCount')).value;
    const infectOtherCount : number = parseInt(infectOtherCountStr);
    infectOthers(infectOtherCount);
    render(canvas, populationOfPersons);
}
