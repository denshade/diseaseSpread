const populationOfPersons = [];

class Person
{
    isInfected : boolean;
    daysUntilHealed : number;
    isImmune: boolean;

    constructor(isInfected:boolean, daysUntilHealed: number)
    {
        if (isInfected) {
            this.tryInfect(daysUntilHealed);
        }
        this.isImmune = false;
    }

    public tryInfect(daysInfectious: number)
    {
        if (!this.isImmune && !this.isInfected)
        {
            this.isInfected = true;
            this.daysUntilHealed = daysInfectious;
        }
    }

    public tryHeal()
    {
        if (this.isInfected)
        {
            this.daysUntilHealed --;
            if (this.daysUntilHealed < 1) {
                this.isInfected = false;
                this.isImmune = true;
            }
        }
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
    ctx.fillStyle = "#FFF000";
    ctx.fillRect(0, 0, squareSize, squareSize);

    //433
    for (let k = 0; k < persons.length; k++ ) {
        if (persons[k].isInfected) {
            ctx.fillStyle = "red";
        } else if (persons[k].isImmune) {
            ctx.fillStyle = "blue";
        } else {
            ctx.fillStyle = "green";
        }
        ctx.fillRect(k % squareSize,k / squareSize,1, 1);
    }

    var end = new Date().getTime();
    console.log("Performance " + (end-start));
}

const initializePopulation = (populationOfPersons: Person[], numberPeople : number, infectedSize : number, daysUntilHealed : number) : Person[] =>
{
    populationOfPersons.length = 0;
    for (let i = 0; i < infectedSize; i++)
    {
        populationOfPersons.push(new Person(true, daysUntilHealed));
    }
    while(populationOfPersons.length < numberPeople)
    {
        populationOfPersons.push(new Person(false, daysUntilHealed));
    }
    return populationOfPersons;
}

const infectOthers = (infectOtherCount : number, daysInfectious: number) => {
    const infected = populationOfPersons.filter(s => s.isInfected === true);

    for (let k = 0; k < infected.length; k++)
    {
        let p: Person = infected[k];
        p.tryHeal();
    }

    for (let k = 0; k < infected.length; k++)
    {
        for (let z = 0; z < infectOtherCount; z++)
        {
            const index = Math.round(Math.random() * (populationOfPersons.length - 1));
            let p: Person = populationOfPersons[index];
            p.tryInfect(daysInfectious);
        }
    }
}

const init = () => {
    const initbtn = document.getElementById('initbtn')  as HTMLInputElement;
    initbtn.disabled = true;

    const canvas = <HTMLCanvasElement>document.getElementById('populationCanvas');
    const populationString = (<HTMLInputElement>document.getElementById('population')).value;
    const populationSize : number = parseInt(populationString);
    const infectedString = (<HTMLInputElement>document.getElementById('numberInfected')).value;
    const infectedSize : number = parseInt(infectedString);
    const daysInfectiousStr = (<HTMLInputElement>document.getElementById('daysInfectious')).value;
    const daysInfectious : number = parseInt(daysInfectiousStr);

    initializePopulation(populationOfPersons, populationSize, infectedSize, daysInfectious);
    render(canvas, populationOfPersons)
    initbtn.disabled = false;
}

const simulate = () => {

    const initbtn = document.getElementById('initbtn')  as HTMLInputElement;
    const stepbtn = document.getElementById('stepbtn')  as HTMLInputElement;

    initbtn.disabled = true;
    stepbtn.disabled = true;

    const canvas = <HTMLCanvasElement>document.getElementById('populationCanvas');
    const infectOtherCountStr = (<HTMLInputElement>document.getElementById('infectOtherCount')).value;
    const infectOtherCount : number = parseInt(infectOtherCountStr);
    const daysInfectiousStr = (<HTMLInputElement>document.getElementById('daysInfectious')).value;
    const daysInfectious : number = parseInt(daysInfectiousStr);
    infectOthers(infectOtherCount, daysInfectious);
    render(canvas, populationOfPersons);
    initbtn.disabled = false;
    stepbtn.disabled = false;
}
