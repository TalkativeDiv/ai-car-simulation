const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
const carCtx = carCanvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")
const average = array => array.reduce((a, b) => a + b) / array.length;
let weights = []
let biases = []

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)
N = 100
let cars = generateCars(N)
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),

]
let bestCar = cars[0];

animate()

if (localStorage.getItem("bestBrain")) {
    for(let i =0; i<cars.length;i++){
        cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"))
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,.1)
        }
    }
}
function save() { localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain)) }
function discard() { localStorage.removeItem("bestBrain") }


function generateCars(n) {
    const cars = []
    for (let i = 1; i <= n; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars
}

function animate(time) {
    bestCar.brain.levels.forEach(level => {
        level.weights.forEach(
            weight => {
                weights.push(average(weight))
            }
        )
        level.biases.forEach(
            bias => {
                biases.push(bias)
            }
        )
    })
    document.getElementById("bestCarMutation").innerText = `Weights: ${(weights.reduce((p,c,_,a) => p + c/a.length,0)).toFixed(2)} \n Biases: ${(biases.reduce((p,c,_,a) => p + c/a.length,0)).toFixed(2)} `
    if(cars.every(car => car.damaged)){
        const userWantsRefresh = confirm("Do you want to refresh?")
        if(userWantsRefresh){
            window.location.reload()
        }
        return
    }
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        )
    )
   
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "red");
    }
    carCtx.globalAlpha = 0.2
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1
    bestCar.draw(carCtx, "blue", true);
    carCtx.restore();

    networkCtx.lineDashOffset = -time / 60;
    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    requestAnimationFrame(animate);
}