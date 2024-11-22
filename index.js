let floor = 0
let lift = 0
let canvas = document.getElementById("simulationCanvas")

let engineData = {}

const submitForm = (e)=>{
    e.preventDefault()

    // Disables the submit button after creating the simulation
    let submit = document.getElementById('submit')
    submit.setAttribute('disabled', true)

    // get the value of floor and lift submitted
    floor = document.getElementById('floor').value
    lift = document.getElementById('lift').value
    console.log("Number of Floor: ", floor)
    console.log("Number of Lift: ", lift)

    createFloors(floor)

}

const createFloors = (numsOfFloor)=>{
    for(let i = numsOfFloor; i > 0; i--){  
        // adding floors to engineData
        engineData[i] = {}

        // main div
        const floorDiv = document.createElement('div')
        floorDiv.setAttribute('id', `floor${i}`)
        floorDiv.setAttribute('class', `floor`)

        // div for the buttons
        const buttonDiv = document.createElement('div')
        buttonDiv.setAttribute('class', 'buttons')

        // UP Button
        const upButton = document.createElement('button')
        upButton.setAttribute('class', 'upButton')
        upButton.innerHTML = 'UP'
        upButton.addEventListener('click', ()=>moveup(i))
        // Disabling the UP button for the lift at the ground floor
        if(i == 1){
            upButton.setAttribute('disabled', 'true')
        }

        // DOWN Button
        const downButton = document.createElement('button')
        downButton.setAttribute('class', 'downButton')
        downButton.innerHTML = 'DOWN'
        downButton.addEventListener('click', ()=>movedown(i))
        // Disabling the DOWN button for the topmost floor
        if(i == numsOfFloor){
            downButton.setAttribute('disabled', 'true')
        }

        buttonDiv.appendChild(upButton)
        buttonDiv.appendChild(downButton)
        
        floorDiv.appendChild(buttonDiv)

        canvas.appendChild(floorDiv)
    }
    console.log(engineData)
    createLifts(lift)
}


const createLifts = (numsOfLifts)=>{
    let floor1Div = document.getElementById('floor1')
    // console.log(floor1Div)
    let allLiftDiv = document.createElement('div')
    allLiftDiv.setAttribute('class','allLifts')

    for(let i = 0; i < numsOfLifts; i++){

        // adding lifts to engineData
        engineData[1][i+1] = 'available'


        // lift div
        let liftDiv = document.createElement('div')
        liftDiv.setAttribute('class', 'lift')
        liftDiv.setAttribute('id', `lift${i+1}`)

        // left door
        let leftDoor = document.createElement('div')
        leftDoor.setAttribute('class', 'door leftDoor')
        leftDoor.setAttribute('id', 'leftDoor')

        // right door
        let rightDoor = document.createElement('div')
        rightDoor.setAttribute('class', 'door rightDoor')
        rightDoor.setAttribute('id', 'rightDoor')

        liftDiv.appendChild(leftDoor)
        liftDiv.appendChild(rightDoor)

        allLiftDiv.appendChild(liftDiv)
    }
    floor1Div.appendChild(allLiftDiv)
}


const moveup = (floorId)=>{
    console.log(`Up button clicked of floor ${floorId}`)

    let minDistance = Number.MAX_SAFE_INTEGER
    let closestFloorWithLift = -1
    let liftNo = -1
    let liftId = ''
    // itertates through each floor until the current floor is reached
    for(let i = 1; i < floorId; i++){
        // checks if there are lifts on the current floor
        for(let lift in engineData[i]){
            if(engineData[i][lift] == 'available'){
                if(Math.abs(floorId - i) < minDistance){
                    minDistance = Math.abs(floorId -i)
                    closestFloorWithLift = i
                    liftNo = lift
                    liftId = `lift${lift}`
                }
            }
        }
    }

    if(closestFloorWithLift != -1 && liftNo != -1){   
        engineData[closestFloorWithLift][liftNo] = 'unavailable'
        console.log(engineData)

        let lift = document.getElementById(liftId)
        let leftDoor = lift.querySelector('#leftDoor')
        let rightDoor = lift.querySelector('#rightDoor')

        lift.style.position = 'relative'
        lift.style.transition = `all ${(minDistance)*2}s`
        lift.style.bottom = `${(floorId-1)*10}rem`

        leftDoor.style.transition = "left 2.5s";
        rightDoor.style.transition = "right 2.5s";

        // opens gate after lift reaches the floor
        setTimeout(()=>{
            leftDoor.style.left = `-100px`
            rightDoor.style.right = `-100px`
        }, ((minDistance)*2000))

        // Closes gate after lift reaches the floor and doors open
        setTimeout(()=>{
            leftDoor.style.left = `0px`
            rightDoor.style.right = `0px`
        }, ((minDistance)*2000 + 2500))    

        // mark the lift as available in the engineDData for future requests
        setTimeout(()=>{
            delete engineData[closestFloorWithLift][liftNo]
            engineData[floorId][liftNo] = 'available'
            console.log(engineData)
        }, ((minDistance)*2000 + 5000))
    }
}


const movedown = (floorId)=>{
    console.log(`Down button clicked of floor ${floorId}`)

    let minDistance = Number.MAX_SAFE_INTEGER
    let closestFloorWithLift = -1
    let liftNo = -1
    let liftId = ''

    for(let i = floor; i > floorId; i--){
        for(let lift in engineData[i]){
            console.log('lift: ',lift)
            if(engineData[i][lift] == 'available'){
                if(Math.abs(floorId -i) < minDistance){
                    minDistance = Math.abs(floorId -i)
                    closestFloorWithLift = i
                    liftNo = lift
                    liftId = `lift${lift}`
                }
            }
        }
    }

    if(closestFloorWithLift != -1 && liftNo != -1){
        engineData[closestFloorWithLift][liftNo] = 'unavailable'
        console.log(engineData)

        let lift = document.getElementById(liftId)
        let leftDoor = lift.querySelector('#leftDoor')
        let rightDoor = lift.querySelector('#rightDoor')

        // css styling to move the lift to the destination floor
        lift.style.position = 'relative'
        lift.style.transition = `all ${(minDistance)*2}s`
        lift.style.bottom = `${(floorId-1)*10}rem`

        leftDoor.style.transition = "left 2.5s";
        rightDoor.style.transition = "right 2.5s";

        setTimeout(()=>{
            leftDoor.style.left = `-100px`
            rightDoor.style.right = `-100px`
        }, ((minDistance)*2000))

        setTimeout(()=>{
            leftDoor.style.left = `0px`
            rightDoor.style.right = `0px`

        }, ((minDistance)*2000 + 2500))

        setTimeout(()=>{
            delete engineData[closestFloorWithLift][liftNo]
            engineData[floorId][liftNo] = 'available'
            console.log(engineData)
        }, ((minDistance)*2000 + 5000))
    }
}


const reset = ()=>{
    canvas.innerHTML = ''
    let submit = document.getElementById('submit')
    submit.setAttribute('disabled', false)
    
}