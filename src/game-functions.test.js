const { ship, gameboard } = require('./game-functions')

test('ship hitFn', () => {
  expect(ship().hitFn()).toMatchObject({ hits: 1 })
})

test('ship checkShipCondition', () => {
  const originalShip = ship()
  const mockShip = { ...originalShip, length: 3, hits: 3 }
  const mockShip2 = { ...originalShip, length: 3, hits: 2 }
  expect(mockShip.checkShipCondition()).toMatchObject({
    sunk: true,
  })
  expect(mockShip2.checkShipCondition()).toMatchObject({
    sunk: false,
  })
})

test('gameboard placeship', () => {
  const originalShip = ship()
  const mockShip = { ...originalShip, name: 'patrolBoat', length: 2 }
  const originalGame = gameboard()

  originalGame.placeShip(mockShip, [0, 0])
  expect(originalGame.placedShips).toEqual([0, 0, mockShip, 1, 0, mockShip])
})

test('gameboard receiveAttack', () => {
  const originalShip = ship()
  const mockShip = { ...originalShip, name: 'patrolBoat', length: 2 }
  const originalGame = gameboard()
  const mockGame = {
    ...originalGame,
    placedShips: [0, 0, mockShip, 1, 0, mockShip],
  }

  mockGame.receiveAttack([1, 0])
  expect(mockShip.hits).toEqual(1)

  mockGame.receiveAttack([2, 0])
  expect(mockGame.missedAttacks).toEqual([[2, 0]])
})

test('gameboard checkGameCondition', () => {
  const originalShip = ship()
  const mockShip = { ...originalShip, name: 'patrolBoat', length: 2 }
  const originalGame = gameboard()
  const mockGame = {
    ...originalGame,
    placedShips: [0, 0, mockShip, 1, 0, mockShip],
  }

  mockShip.hitFn()
  expect(mockShip.sunk).toEqual(false)
  mockGame.checkGameCondition()
  expect(mockGame.allSunk).toEqual(false)

  mockShip.hitFn()
  expect(mockShip.sunk).toEqual(true)
  mockGame.checkGameCondition()
  expect(mockGame.allSunk).toEqual(true)
})
