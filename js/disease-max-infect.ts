const populationOfPersons = [];

class Person
{
    isInfected : boolean;
    daysUntilHealed : number;
    isImmune: boolean;
    infectedVictims : number;
    isDead : boolean;

    constructor(isInfected:boolean, daysUntilHealed: number)
    {
        if (isInfected) {
            this.tryInfect(daysUntilHealed);
        }
        this.isImmune = false;
        this.infectedVictims = 0;
        this.isDead = false;
    }

    public tryInfect(daysInfectious: number)
    {
        if (!this.isImmune && !this.isInfected)
        {
            if (Math.random() * 100 < deathRate())
            {
                this.isDead = true;
                this.isInfected = false;
            } else {
                this.isInfected = true;
                this.daysUntilHealed = daysInfectious;
            }
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
const deathRate = () => parseInt((document.getElementById('deathPercentage') as HTMLInputElement).value);
const deathCount = () => (document.getElementById('deathCount') as HTMLInputElement);
const immuneCount = () => (document.getElementById('immuneCount') as HTMLInputElement);
const diseasedCount = () => (document.getElementById('diseasedCount') as HTMLInputElement);


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
        if (persons[k].isDead) {
            ctx.fillStyle = "#000000";
        } else if (persons[k].isInfected) {
            ctx.fillStyle = "#721c24";
        } else if (persons[k].isImmune) {
            ctx.fillStyle = "#004085";
        } else {
            ctx.fillStyle = "#155724";
        }
        ctx.fillRect(Math.floor(k % squareSize) * personSize,Math.floor(k / squareSize)*personSize, personSize, personSize);
    }
    deathCount().value = (100 * persons.filter((v) => v.isDead === true).length / persons.length) +"";
    immuneCount().value = (100 * persons.filter((v) => v.isImmune === true).length / persons.length) +"";
    diseasedCount().value = (100 * persons.filter((v) => v.isInfected === true).length / persons.length) +"";

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
        let infector = infected[k] as Person;
        if (infector.infectedVictims < infectOtherCount)
        {
            const index = Math.round(Math.random() * (populationOfPersons.length - 1));
            let p: Person = populationOfPersons[index];
            p.tryInfect(daysInfectious);
            infector.infectedVictims++;
        }
    }
}

const hideElements = () =>
{
    const initbtn = document.getElementById('initbtn')  as HTMLInputElement;
    initbtn.disabled = true;
    const stepbtn = document.getElementById('stepbtn')  as HTMLInputElement;
    stepbtn.disabled = true;
    stepbtn.value = "Running";
    const calculating = document.getElementById('calculating')  as HTMLDivElement;
    calculating.style.display = 'block';
}

const showElements = () => {
    const initbtn = document.getElementById('initbtn')  as HTMLInputElement;
    initbtn.disabled = false;
    const stepbtn = document.getElementById('stepbtn')  as HTMLInputElement;
    stepbtn.disabled = false;
    stepbtn.value = "Simulate next step";
    const calculating = document.getElementById('calculating')  as HTMLDivElement;
    calculating.style.display = 'none';
}

const init = () => {
    hideElements();
    stepNrElement().value = "0";
    initializePopulation(populationOfPersons, populationSize(), infectedSize(), daysInfectious());
    render(canvas(), populationOfPersons)
    showElements();
}

const simulate = () => {
    hideElements();
    let stepNrEl = stepNrElement();
    stepNrEl.value = (parseInt(stepNrEl.value) + 1) + "";

    infectOthers(infectOtherCount(), daysInfectious());

    render(canvas(), populationOfPersons);

    showElements();
}

const simulate10 = () => {
    hideElements();
    let stepNrEl = stepNrElement();
    stepNrEl.value = (parseInt(stepNrEl.value) + 10) + "";

    for (let k = 0; k < 10; k++)
        infectOthers(infectOtherCount(), daysInfectious());

    render(canvas(), populationOfPersons);

    showElements();
}
