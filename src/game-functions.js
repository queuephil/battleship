// 1	carrier	    5
// 2	battleship	4
// 3	destroyer	3
// 4	submarine	3
// 5	patrolBoat	2
function ship(name, length) {
  return {
    name: name,
    length: length,
    hits: 0,
    sunk: false,
    hitFn() {
      this.hits = this.hits + 1
      this.checkShipCondition()
      return this
    },
    checkShipCondition() {
      if (this.hits == this.length) this.sunk = true
      return this
    },
  }
}

// 10x10
function gameboard() {
  function createCoordinates(size) {
    let array = []
    for (let y = 9; y >= 0; y--) {
      for (let x = 0; x < size; x++) {
        array.push([x, y])
      }
    }
    return array
  }
  return {
    coordinates: createCoordinates(10),
    placedShips: [],
    placeShip(ship, [x, y]) {
      for (let i = 0; i < ship.length; i++) {
        this.placedShips.push(x + i, y, ship)
      }
      return this
    },
    missedAttacks: [],
    receiveAttack([x, y]) {
      const hitShip = this.placedShips.reduce((previous, _, index, array) => {
        if (previous) return previous
        if (array[index] == x && array[index + 1] == y) return array[index + 2]
        return null
      }, null)
      hitShip !== null ? hitShip.hitFn() : this.missedAttacks.push([x, y])
      this.checkGameCondition()
      return this
    },
    allSunk: false,
    checkGameCondition() {
      this.allSunk = this.placedShips.reduce((allSunk, value) => {
        if (typeof value === 'object' && value.sunk === false) return false
        return allSunk
      }, true)
      return this
    },
  }
}

function player() {
  return {
    type: '',
    gameboard: gameboard(),
  }
}

export { ship, gameboard, player }
// module.exports = { ship, gameboard, player }
