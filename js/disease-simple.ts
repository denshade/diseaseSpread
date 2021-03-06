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

    public progressDisease()
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

//SELECTORS
const canvas = () => document.getElementById('populationCanvas') as HTMLCanvasElement;
const populationSize = () => parseInt((document.getElementById('population') as HTMLInputElement).value);
const infectedSize =  () =>parseInt((document.getElementById('numberInfected') as HTMLInputElement).value);
const daysInfectious = () => parseInt((document.getElementById('daysInfectious') as HTMLInputElement).value);
const infectOtherCount = () => parseInt((<HTMLInputElement>document.getElementById('infectOtherCount')).value);
const stepNrElement = () => (<HTMLInputElement>document.getElementById('stepNr'));


//LOGIC
const render = (canvas: HTMLCanvasElement, persons : Person[]) =>
{
    const sizeElement = document.getElementById('pixels') as HTMLSelectElement;
    const selectedOption = sizeElement.selectedOptions.item(0);
    const personSize = parseInt(selectedOption.value);
    var start = new Date().getTime();

    const squareSize : number =  Math.ceil(Math.sqrt(persons.length));
    canvas.width = squareSize * personSize;
    canvas.height = squareSize * personSize;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let k = 0; k < persons.length; k++ ) {
        if (persons[k].isInfected) {
            ctx.fillStyle = "#721c24";
        } else if (persons[k].isImmune) {
            ctx.fillStyle = "#004085";
        } else {
            ctx.fillStyle = "#155724";
        }
        ctx.fillRect(Math.floor(k % squareSize) * personSize,Math.floor(k / squareSize)*personSize, personSize, personSize);
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

    infected.forEach((infected) => infected.progressDisease());

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

const hideElements = () =>
{
    const initbtn = document.getElementById('initbtn')  as HTMLInputElement;
    initbtn.disabled = true;
    const stepbtn = document.getElementById('stepbtn')  as HTMLInputElement;
    stepbtn.disabled = true;
    const calculating = document.getElementById('calculating')  as HTMLDivElement;
    calculating.style.display = 'block';
}

const showElements = () => {
    const initbtn = document.getElementById('initbtn')  as HTMLInputElement;
    initbtn.disabled = false;
    const stepbtn = document.getElementById('stepbtn')  as HTMLInputElement;
    stepbtn.disabled = false;
    const calculating = document.getElementById('calculating')  as HTMLDivElement;
    calculating.style.display = 'none';
}

const init = () => {
    hideElements();
    initializePopulation(populationOfPersons, populationSize(), infectedSize(), daysInfectious());
    render(canvas(), populationOfPersons)
    showElements();
}

const simulate = () => {
    hideElements();
    if (populationOfPersons.length == 0) {
        init();
    }

    let stepNrEl = stepNrElement();
    stepNrEl.value = (parseInt(stepNrEl.value) + 1) + "";

    infectOthers(infectOtherCount(), daysInfectious());

    render(canvas(), populationOfPersons);

    showElements();
}
