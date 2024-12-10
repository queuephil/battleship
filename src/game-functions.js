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
      if (this.checkAlreadyPlaced(ship, [x, y]) == false) return false

      for (let i = 0; i < ship.length; i++) {
        this.placedShips.push(x + i, y, ship)
      }

      return this
    },
    checkAlreadyPlaced(ship, [x, y]) {
      if (x + parseInt(ship.length) > 10) return false

      const xArray = []
      for (let i = 0; i < ship.length; i++) xArray.push(x + i)
      if (
        this.placedShips.some((_, index, array) => {
          return xArray.some((value) => {
            return array[index] == value && array[index + 1] == y
          })
        })
      ) {
        return false
      }
    },
    attacks: [],
    receiveAttack([x, y]) {
      if (this.checkAlreadyAttacked([x, y]) == true) return false

      const hitShip = this.placedShips.reduce((previous, _, index, array) => {
        if (previous) return previous
        if (array[index] == x && array[index + 1] == y) return array[index + 2]
        return null
      }, null)
      hitShip !== null
        ? (hitShip.hitFn(), this.attacks.push(x, y, 'hit'))
        : this.attacks.push(x, y, 'missed')
      this.checkGameCondition()
      return this
    },
    checkAlreadyAttacked([x, y]) {
      return this.attacks.some((_, index, array) => {
        return array[index] == x && array[index + 1] == y
      })
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

function player(name) {
  return {
    name,
    gameboard: gameboard(),
  }
}

export { ship, gameboard, player }
// module.exports = { ship, gameboard, player }
