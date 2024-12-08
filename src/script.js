// import CSS into JS
import './style.css'
import { dom } from 'queuephil-dom-methods'
import { ship, gameboard, player } from './game-functions.js'

const playerGameboard = gameboard()
dom.addElement('main', 'div', '', { class: 'gameboard', id: 'playerGameboard' })
playerGameboard.coordinates.forEach((coordinate) => {
  dom.addElement('#playerGameboard', 'div', '', {
    class: 'gamefield',
    'data-id': coordinate,
  })
})

const computerGameboard = gameboard()
dom.addElement('main', 'div', '', {
  class: 'gameboard',
  id: 'computerGameboard',
})
computerGameboard.coordinates.forEach((coordinate) => {
  dom.addElement(
    '#computerGameboard',
    'div',
    '',
    {
      class: 'gamefield',
      'data-id': coordinate,
    },
    // get coordinates of players click
    {
      click: (e) => {
        const dataIdAsArray = e.target.dataset.id
          .split(',')
          .map((item) => parseInt(item))
        return (
          console.log(dataIdAsArray),
          computerGameboard.receiveAttack(dataIdAsArray),
          console.log(computerGameboard)
        )
      },
    },
  )
})

// place computers ships
// randomly?!
computerGameboard.placeShip(ship('carrier', 5), [0, 1])
computerGameboard.placeShip(ship('battleship', 4), [2, 1])
computerGameboard.placeShip(ship('destroyer', 3), [4, 1])
computerGameboard.placeShip(ship('submarine', 3), [6, 1])
computerGameboard.placeShip(ship('patrolBoat', 2), [8, 1])

// place players ships
// manually?!
playerGameboard.placeShip(ship('carrier', 5), [0, 1])
playerGameboard.placeShip(ship('battleship', 4), [2, 1])
playerGameboard.placeShip(ship('destroyer', 3), [4, 1])
playerGameboard.placeShip(ship('submarine', 3), [6, 1])
playerGameboard.placeShip(ship('patrolBoat', 2), [8, 1])

// play alternatingly

// visualize hits & misses

// gameover if allSunk
