import {useEffect, useState} from 'react'

const WIDTH = 8;
const CANDYCOLORS = [
    'blue',
    'green',
    'orange',
    'purple',
    'red',
    'yellow'
];
function App() {
    //Key / Value pair, ref 'setCurrentColorArrangement(randomColorArrangement)'
    const [currentColorArrangement, setCurrentColorArrangement] = useState([])
    const [squareBeingDragged, setSquareBeingDragged] = useState([])
    const [squareBeingReplaced, setSquareBeingReplaced] = useState([])

    const checkForColumnOfThree = () => {
        for (let i = 0; i < 47; i++) {
            const columnOfThree = [i, i +WIDTH, i + WIDTH * 2]
            const decidedColor = currentColorArrangement[i]

            if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor)) {
                columnOfThree.forEach(square => currentColorArrangement[square] = '')
                return true
            }
        }
        return false
    }

    const checkForRowOfThree = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfThree = [i, i + 1, i + 2]
            const decidedColor = currentColorArrangement[i]

            if (i % 7 === 0 || i % 6 === 0) {
                continue
            }

            if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor)) {
                rowOfThree.forEach(square => currentColorArrangement[square] = '')
                return true
            }
        }
        return false
    }

    const checkForColumnOfFour = () => {
        for (let i = 0; i < 39; i++) {
            //Each entry is the column
            const columnOfFour = [i, i +WIDTH, i + WIDTH * 2, i + WIDTH * 3]
            const decidedColor = currentColorArrangement[i]

            if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor)) {
                columnOfFour.forEach(square => currentColorArrangement[square] = '')
                return true
            }
        }
        return false
    }

    const checkForRowOfFour = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfFour = [i, i + 1, i + 2, i + 3]
            const decidedColor = currentColorArrangement[i]

            if (i % 7 === 0 || i % 6 === 0 || i % 5 === 0) {
                continue
            }

            if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor)) {
                rowOfFour.forEach(square => currentColorArrangement[square] = '')
                return true
            }
        }
        return false
    }

    const moveIntoSquareBelow = () => {
        for (let i = 0; i < 64 - WIDTH; i++) {
            if (i < WIDTH && currentColorArrangement[i] === '') {
                const randNum = Math.floor(Math.random() * CANDYCOLORS.length)
                currentColorArrangement[i] = CANDYCOLORS[randNum]
            }
            if ((currentColorArrangement[i + WIDTH]) === '') {
                currentColorArrangement[i + WIDTH] = currentColorArrangement[i]
                currentColorArrangement[i] = ''
            }
        }
    }

    const dragStart = (e) => {
        setSquareBeingDragged(e.target)
    }


    const dragDrop = (e) => {
        setSquareBeingReplaced(e.target)
    }


    const dragEnd = (e) => {
        const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
        const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

        currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.style.backgroundColor
        currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.style.backgroundColor

        const validMoves = [
            squareBeingDraggedId - 1,
            squareBeingDraggedId - WIDTH,
            squareBeingDraggedId + 1,
            squareBeingDraggedId + WIDTH,
        ]

        const validMove = validMoves.includes(squareBeingReplacedId)
        const cof = checkForColumnOfFour()
        const rof = checkForRowOfFour()
        const cot = checkForColumnOfThree()
        const rot = checkForRowOfThree()

        if (validMove && (cof || cot || rot || rof)) {
            setSquareBeingDragged(null)
            setSquareBeingReplaced(null)
            // This is successfull move, so now might be a good time to check for more combos??
        } else {
            currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.style.backgroundColor
            currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.style.backgroundColor
            setCurrentColorArrangement([...currentColorArrangement])
        }
    }

    function createBoard() {
        const randomColorArrangement = [];
        for (let i = 0; i < WIDTH * WIDTH; i++) {
            //Establish a random color randomly from our list of colors
            const randomColor = CANDYCOLORS[Math.floor(Math.random() * CANDYCOLORS.length)];
            randomColorArrangement.push(randomColor);
        }
        setCurrentColorArrangement(randomColorArrangement);
    }

    //Let's view our value by ref the Key
    // console.log(currentColorArrangement)

    useEffect(() => {
        createBoard();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            checkForColumnOfFour()
            checkForRowOfFour()
            checkForColumnOfThree()
            checkForRowOfThree()
            moveIntoSquareBelow()
            setCurrentColorArrangement([...currentColorArrangement])
        }, 100)
        return () => clearInterval(timer)
    }, [checkForColumnOfFour,checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currentColorArrangement]);


    return (
        <div className="app">
            <div className="game">
                {/*We use the map method, in which we ref CANDYCOLORS within the function we are refing the indexed element*/}
                {currentColorArrangement.map((CANDYCOLORS, index) => (
                    <img
                        key={index}
                        style={{backgroundColor: CANDYCOLORS}}
                        alt={CANDYCOLORS}
                        data-id={index}
                        draggable={true}
                        onDragStart={dragStart}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                        onDragLeave={(e) => e.preventDefault()}
                        onDrop={dragDrop}
                        onDragEnd={dragEnd}
                    />
                    ))}
            </div>
        </div>
    );
}

export default App;
