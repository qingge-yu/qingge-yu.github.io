/*----- constants -----*/

const suits = ['d', 'h', 's', 'c']
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A']
let deck = null


/*----- app's state (variables) -----*/

let turn

let playerHand = []
let dealerHand = []
let playedCards = []
let cardCount = 0
let balance = 100
let bet = 0


/*----- cached element references -----*/

const resetBtnEl = document.getElementById('reset-btn')
const hitBtnEl = document.getElementById('hit-btn')
const standBtnEl = document.getElementById('stand-btn')
const playerCardsEl = document.querySelector('.player-cards')
const dealerCardsEl = document.querySelector('.dealer-cards')
const messageEl = document.querySelector('h2')
const messageDealerEl = document.getElementById('dealer-score')
const messagePlayerEl = document.getElementById('player-score')
const betEl = document.querySelector('.bet')
const betTwoEl = document.getElementById('two')
const betFiveEl = document.getElementById('five')
const betTenEl = document.getElementById('ten')
const balanceEl = document.getElementById('balance')
const betAmountEl = document.getElementById('bet-amount')
const newGameEl = document.getElementById('new-game')
const placeBetMsgEl = document.querySelector('h4')



/*----- event listeners -----*/

resetBtnEl.addEventListener('click', init)
hitBtnEl.addEventListener('click', playerTurn)
standBtnEl.addEventListener('click', handleStandClick)
betTwoEl.addEventListener('click', handleBetTwoClick)
betFiveEl.addEventListener('click', handleBetFiveClick)
betTenEl.addEventListener('click', handleBetTenClick)
newGameEl.addEventListener('click', newGame)



/*----- functions -----*/

function newDeck() {
    deck = []
    for (let suitIdx = 0; suitIdx < 4; suitIdx++) {
        for (let rankIdx = 0; rankIdx < 13; rankIdx++) {
            deck.push(suits[suitIdx] + ranks[rankIdx])
        }
    }
}

function init() {
    newDeck()
    turn = 1
    document.querySelector(".dealer-cards").innerHTML = ""
    document.querySelector(".player-cards").innerHTML = ""
    messageEl.innerText = "Blackjack"
    messageDealerEl.innerText = ""
    messagePlayerEl.innerText = ""
    playerHand = []
    dealerHand = []
    playedCards = []
    cardCount = 0
    bet = 0
    standBtnEl.disabled = false
    hitBtnEl.disabled = false
    resetBtnEl.style.display = "none"
    balanceEl.textContent = `Your balance: $${betResult(balance)}`
    betAmountEl.textContent = ''
    betTwoEl.disabled = false
    betFiveEl.disabled = false
    betTenEl.disabled = false
}

function handleStandClick() {
    turn *= -1
    dealerTurn()
    standBtnEl.disabled = true
    hitBtnEl.disabled = true
    betResult()
}

function dealerTurn() {
    drawCard(dealerHand)
    while (handValue(dealerHand) < 17 && handValue(playerHand) <= 21) {
        drawCard(dealerHand)
        handValue(dealerHand)
    }
    checkWin()
    messageDealerEl.textContent = "Dealer hand total: " + handValue(dealerHand)
}

function playerTurn() {
    drawCard(playerHand)
    messagePlayerEl.textContent = "Your hand total: " + handValue(playerHand)
}

function drawCard(array) {
    let randomCard = deck[Math.floor(Math.random() * (52 - cardCount))]
    if (!playedCards.includes(randomCard)) {
        playedCards.push(randomCard)
        array.push(randomCard)
        deck = deck.filter(function (usedCard) {
            return usedCard !== randomCard
        })
        addCardToHand()
        cardCount++
    }
}

function addCardToHand() {
    if (turn === 1) {
        let playerNewCard = document.createElement('div')
        playerNewCard.classList.add('card', `${playerHand[playerHand.length - 1]}`, 'large')
        playerCardsEl.appendChild(playerNewCard)
    } else if (turn === -1) {
        let dealerNewCard = document.createElement('div')
        dealerNewCard.classList.add('card', `${dealerHand[dealerHand.length - 1]}`, 'large')
        dealerCardsEl.appendChild(dealerNewCard)
    }
}

function tamegap(dealerCard) {
    setTimeout(function () {

    })
}

function handValue(array) {
    let cardValue = 0
    array.forEach(function (card) {
        let arr = card.split('')
        let cardIdx = arr[arr.length - 1]
        if (cardIdx === 'J' || cardIdx === 'Q' || cardIdx === 'K' || cardIdx === '0') {
            cardValue += 10
        } else if (cardIdx === 'A') {
            cardValue += 11
        } else {
            cardValue += parseInt(cardIdx, 10)
        }
    })
    let aceArray = []
    array.forEach(function (name) {
        name = name.split('')
        if (name.includes('A')) {
            aceArray.push(name.filter(function (char) {
                return char === 'A'
            }))
        }

    })
    let aceCount = aceArray.length
    if (aceCount && cardValue > 21) {
        while (cardValue > 21 && aceCount) {
            cardValue -= 10
            aceCount--
        }
    }
    if (cardValue > 21 && turn === 1) {
        hitBtnEl.disabled = true
    }
    return cardValue
}


function checkWin() {
    const playerTotal = handValue(playerHand)
    const dealerTotal = handValue(dealerHand)
    if (dealerTotal === playerTotal && dealerTotal <= 21) {
        messageEl.textContent = "It's a tie!"
    }
    if (playerTotal === 21) {
        messageEl.textContent = "You win!"
    }
    if (dealerTotal === 21) {
        messageEl.textContent = "Dealer wins!"
    }
    if (playerTotal > 21) {
        messageEl.textContent = "Dealer wins!"
    }
    if (playerTotal > dealerTotal && dealerTotal >= 17) {
        messageEl.textContent = "You win!"
    }
    if (playerTotal < dealerTotal && dealerTotal < 21) {
        messageEl.textContent = "Dealer wins!"
    }
    if (playerTotal < dealerTotal && dealerTotal > 21) {
        messageEl.textContent = "You win!"
    }
    resetBtnEl.style.display = "inline-block"
}


//--Icebox: Betting Features--

function handleBetTwoClick() {
    bet += 2
    betTwoEl.disabled = true
    betFiveEl.disabled = true
    betTenEl.disabled = true
    balanceEl.textContent = `Your balance: $${calcBalance(balance)}`
    betAmountEl.textContent = `Current bet: $${checkBetBtn(bet)}`
}

function handleBetFiveClick() {
    bet += 5
    betTwoEl.disabled = true
    betFiveEl.disabled = true
    betTenEl.disabled = true
    balanceEl.textContent = `Your balance: $${calcBalance(balance)}`
    betAmountEl.textContent = `Current bet: $${checkBetBtn(bet)}`
}

function handleBetTenClick() {
    bet += 10
    betTwoEl.disabled = true
    betFiveEl.disabled = true
    betTenEl.disabled = true
    balanceEl.textContent = `Your balance: $${calcBalance(balance)}`
    betAmountEl.textContent = `Current bet: $${checkBetBtn(bet)}`
}

function checkBetBtn() {
    if (bet === 2) return 2
    if (bet === 5) return 5
    if (bet === 10) return 10
    return 0
}

function calcBalance() {
    balance = balance - checkBetBtn(bet)
    if (balance + checkBetBtn(bet) < 2) {
        messageEl.textContent = "GAME OVER"
        newGameEl.style.display = "inline-block"
        resetBtnEl.style.display = "none"
    }
    return balance
}

function betResult() {
    let betAmt = checkBetBtn(bet)
    if (messageEl.textContent === "You win!") {
        balance = calcBalance(balance) + (betAmt * 3)
    }
    if (messageEl.textContent === "Dealer wins!") {
        balance = calcBalance(balance) + betAmt
    }
    if (messageEl.textContent === "It's a tie!") {
        balance = calcBalance(balance)
    }
    balanceEl.textContent = `Your balance: $${balance}`
    return balance
}

function newGame() {
    newGameEl.style.display = 'none'
    init()
    balance = 100
    betResult(balance) == 100
    bet = 0
    placeBetMsgEl.style.display = 'inline-block'
    betTwoEl.style.display = 'inline-block'
    betFiveEl.style.display = 'inline-block'
    betTenEl.style.display = 'inline-block'
    balanceEl.style.display = 'inline-block'
    betAmountEl.style.display = 'inline-block'
    hitBtnEl.style.display = 'inline-block'
    standBtnEl.style.display = 'inline-block'
}

// before starting game
placeBetMsgEl.style.display = 'none'
betTwoEl.style.display = 'none'
betFiveEl.style.display = 'none'
betTenEl.style.display = 'none'
balanceEl.style.display = 'none'
betAmountEl.style.display = 'none'
hitBtnEl.style.display = 'none'
standBtnEl.style.display = 'none'
resetBtnEl.style.display = 'none'