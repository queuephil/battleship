import './style.css'
import { dom } from 'queuephil-dom-methods'
import { ship, player } from './game-functions.js'

dom.addElement('main', 'div', '', { class: 'gameboards' })

const human = player('human')
dom.addElement('.gameboards', 'div', '', {
  class: 'gameboard',
  id: 'humanGameboard',
})
human.gameboard.coordinates.forEach((coordinate) => {
  dom.addElement('#humanGameboard', 'div', '', {
    class: 'gamefield',
    'data-id': coordinate,
  })
})

const computer = player('computer')
dom.addElement('.gameboards', 'div', '', {
  class: 'gameboard',
  id: 'computerGameboard',
})
computer.gameboard.coordinates.forEach((coordinate) => {
  dom.addElement('#computerGameboard', 'div', '', {
    class: 'gamefield',
    'data-id': coordinate,
  })
})

dom.addElement('main', 'div', 'Place your ships!', { class: 'announcement' })
dom.addElement(
  'main',
  'div',
  'Restart',
  { class: 'button' },
  { click: () => location.reload() },
)

function checkStart() {
  if (
    computer.gameboard.placedShips.length == 51 &&
    human.gameboard.placedShips.length == 51
  ) {
    getHumansTurn()
  }
}

function getHumansTurn() {
  document.querySelector('.announcement').innerHTML = "It's your turn!"

  const element = document.querySelector('#computerGameboard')
  element.addEventListener('click', function handleClick(e) {
    const dataIdAsArray = e.target.dataset.id.split(',').map(Number)

    if (computer.gameboard.receiveAttack(dataIdAsArray) == false) return

    computer.gameboard.receiveAttack(dataIdAsArray)
    element.removeEventListener('click', handleClick)
    showAttacks(computer)
    if (checkWin() == true) return
    getComputersTurn()
    return
  })
}

function getComputersTurn() {
  document.querySelector('.announcement').innerHTML = "It's computers turn!"

  setTimeout(() => {
    let x = 0
    let y = 0
    while (true) {
      x = Math.floor(Math.random() * 10)
      y = Math.floor(Math.random() * 10)
      if (human.gameboard.receiveAttack([x, y])) break
    }
    showAttacks(human)
    if (checkWin() == true) return
    getHumansTurn()
    return
  }, 1000)
}

function showAttacks(player) {
  player.gameboard.attacks.map((_, index, array) => {
    if (index % 3 == 0) {
      const x = array[index]
      const y = array[index + 1]
      const className = array[index + 2]
      const element = document.querySelector(
        `#${player.name}Gameboard>[data-id = "${x},${y}"]`,
      )
      element.classList.add(className)
    }
  })
}

function checkWin() {
  if (human.gameboard.allSunk == true) {
    document.querySelector('.announcement').innerHTML = 'Computer won!'
    return true
  }
  if (computer.gameboard.allSunk == true) {
    document.querySelector('.announcement').innerHTML = 'You won!'
    return true
  }
  return false
}

const ships = [
  ['carrier', 5],
  ['battleship', 4],
  ['destroyer', 3],
  ['submarine', 3],
  ['patrolBoat', 2],
]

for (let i = 0; i < ships.length; ) {
  const [name, length] = ships[i]
  const placedShip = ship(name, length)
  const x = parseInt(Math.random() * 10)
  const y = parseInt(Math.random() * 10)

  if (computer.gameboard.placeShip(placedShip, [x, y]) == false) continue

  computer.gameboard.placeShip(ship(name, length), [x, y])

  i++
}

dom.addElement('main', 'div', '', { class: 'ships' })
ships.forEach((subArray) => {
  const [name, length] = subArray
  dom.addElement(
    '.ships',
    'div',
    '',
    {
      style: `height: 2rem; width: ${length * 2}rem;`,
      draggable: 'true',
      class: 'ship',
      id: name,
      'data-length': length,
    },
    {
      dragstart: (e) => {
        e.dataTransfer.setData(
          'text/plain',
          `${e.target.id},${e.target.dataset.length}`,
        )
      },
    },
  )
})

document.querySelectorAll('#humanGameboard > .gamefield').forEach((el) => {
  el.addEventListener('dragover', (e) => {
    e.preventDefault()
  })
  el.addEventListener('drop', (e) => {
    e.preventDefault()
    const [x, y] = e.target.dataset.id.split(',').map(Number)
    const [name, length] = e.dataTransfer.getData('text').split(',')
    const droppedShip = ship(name, length)

    if (human.gameboard.placeShip(droppedShip, [x, y]) == false) return
    human.gameboard.placeShip(droppedShip, [x, y])

    document.querySelector(`#${name}`).remove()

    human.gameboard.placedShips.map((value, index, array) => {
      if (index % 3 == 0) {
        document
          .querySelector('#humanGameboard')
          .querySelector(`[data-id = "${array[index]},${array[index + 1]}"]`)
          .classList.add('placedShip')
      }
    })
    checkStart()
  })
})

// computer.gameboard.placedShips.map((value, index, array) => {
//   if (index % 3 == 0) {
//     document
//       .querySelector('#computerGameboard')
//       .querySelector(`[data-id = "${array[index]},${array[index + 1]}"]`)
//       .classList.add('placedShip')
//   }
// })

// computerPlayer if hit >> try left / right

// 2player
// dark "otherplayer" >> click
// first player place ships
// dark "otherplayer" >> click
// second player place ships
// dark "otherplayer" >> click
// first player attacks
// dark "otherplayer" >> click
// ...
