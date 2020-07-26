import { isCompositeComponentWithType } from "react-dom/test-utils";


const Bunga = {

  name: "bunga-bunga",

  setup: () => {return setUpCards(4)},

  moves: {
    DrawCard: {
      move: DrawCard,
      nolimit: true
    },
    BungaBunga,
    EndTurn,
    KeepCard,
    PlayCard,
    Swap,
    SetEvent,
    FaceUp,
    FaceDown,
  },

  turn: {
    movelimit: 5,
    onEnd: (G, ctx) => {
      if (G.deck.length === 0) {
        G.deck = G.discarded;
        G.discarded = [];
      }
    },
  },
  // turn: {
  //   stages: {
  //     start: {
  //       moves: {BungaBunga, DrawCard},
  //       next: {'draw'},
  //     },
  //     draw: {
  //       moves: {KeepCard, PlayCard},
  //       next: {'freeforall'},
  //     },
  //     peek: {

  //     },
  //     spy: {

  //     },
  //     blindswap: {

  //     }
  //     freeforall: {

  //     }
  //   }
  // },

  endIf: (G, ctx) => {
    if(!G.cardValue[ctx.currentPlayer]) {return;}

    if(hasEnded(G, ctx)) {
      return Victor(G, ctx);
    }
  },

};

export default Bunga;

function setUpCards (numPlayers) {
  var deck = [];
  const suit = ['D','C','H','S'];
  const num = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
  for(var j = 0; j < 4; j++){
    for(var i  = 0; i < 13; i++) {
      var card = {};
      if ((i > 0) && (i < 12)) {
         card = {
          num: num[i],
          suit: suit[j],
          value: i + 1,
          faceUp: false,
        }
      }
      else if (i === 0) {
        card = {
          num: num[i],
          suit: suit[j],
          value: i,
          faceUp: false,
        }
      }
      else if ((i === 12) && ((j === 0) || (j === 2))) {
        card = {
          num: num[i],
          suit: suit[j],
          value: -1,
          faceUp: false,
        }
      }
      else {
        card = {
          num: num[i],
          suit: suit[j],
          value: 25,
          faceUp: false,
        }
      }
      deck.push(card);
    }
  }

  var btn = {
    pressed: false,
    pressedBy: -1,
    turnPressed: -1,
  }

  var cardValue = [];
  //look into how we can access num players
  for (var i = 0; i < numPlayers; i++) {
    cardValue.push(Array(0));
    for (var j = 0; j < 4; j++) {
      var index = Math.floor(Math.random() * deck.length);
      cardValue[i].push(deck[index]);
      deck.splice(index,1);
    }
  }
  var gameState = {
    cardValue: cardValue,
    deck: deck,
    discarded: [],
    bungaBtn: btn,
    cardDrawn: false,
    currentCard: {},
    //event: '',
    card1: {},  //for swaps
    card2: {},  //for swaps
    peekCard: {}, // for peeks
  };

  //set up cardValue with 4
  return gameState;
}


function Victor(G, ctx) {
  var sums = [];
  for (var i = 0; i < ctx.numPlayers; i++){
    var sum =  0;
    for (var j = 0; j < G.cardValue[i].length; j++ ){
      sum += G.cardValue[i][j].value;
    }
    sums.push(sum);
    alert(sum);
    //alert(sum);
  }
  var min = ctx.currentPlayer;
  for (var i = 0; i < ctx.numPlayers; i++){
    if (sums[i] < sums[min]) {
      min = i;
    }
  }
  return {winner: min};
}

function DrawCard(G, ctx) {
  G.event = 'draw';
  G.cardDrawn = true;
  var index = Math.floor(Math.random() * G.deck.length);
  //G.cardValue[ctx.currentPlayer].push(G.deck[index]);
  G.currentCard = G.deck[index];
  G.deck.splice(index,1);
}


const insert = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index)
]

function KeepCard(G, ctx, cardID) {
  G.event = '';
  const card = G.cardValue[ctx.currentPlayer][cardID];
  G.discarded.push(card);
  //alert(cardID);
  G.cardValue[ctx.currentPlayer].splice(cardID,1);
  G.cardValue[ctx.currentPlayer] = insert(G.cardValue[ctx.currentPlayer],cardID, G.currentCard);

  G.currentCard = {};
  EndTurn(G, ctx);
}

function PlayCard(G, ctx) {
  G.discarded.push(G.currentCard);
  G.currentCard = {};
  if (isPower(G.discarded[G.discarded.length - 1])) {
    power(G, ctx, G.discarded[G.discarded.length - 1].value)
  } else{
    EndTurn(G,ctx);
  }
}

function isPower(card) {
  return (card.value >= 7)  && (card.value <= 12);
}

function power(G,ctx,value) {
  //peek
  switch(value) {
    case 3:
    case 4:
    case 5:
    case 6:
      G.event = 'swap';
      break;
    case 7:
    case 8:
      G.event = 'peek';
      break;
    case 9:
    case 10:
      G.event = 'spy';
      break;
    case 11:
      G.event = 'swap';
      break;
    case 12:
      G.event = 'lookswap';
      break;
    default:
      break;
  }
  return;
}

function Swap(G, ctx) {
  console.log(G.card1.playerId);
  var c1 = G.cardValue[G.card1.playerId][G.card1.key];
  var c2 = G.cardValue[G.card2.playerId][G.card2.key];
  G.cardValue[G.card1.playerId].splice([G.card1.key],1);
  G.cardValue[G.card2.playerId].splice([G.card2.key],1);

  G.cardValue[G.card1.playerId] = insert(G.cardValue[G.card1.playerId],G.card1.key, c2);
  G.cardValue[G.card2.playerId] = insert(G.cardValue[G.card2.playerId],G.card2.key, c1);

}

function FaceUp(G, ctx) {
  console.log(G.cardValue + " " +G.peekCard.playerId);
  G.cardValue[G.peekCard.playerId][G.peekCard.key].faceUp = true;

}
function FaceDown(G, ctx) {
  console.log(G.cardValue + " " +G.peekCard.playerId);
  G.cardValue[G.peekCard.playerId][G.peekCard.key].faceUp = false;

  G.peekCard = {};
  //EndTurn(G,ctx);
  

}

function BungaBunga(G,ctx) {
  const btn = {
    pressed: true,
    pressedBy: ctx.currentPlayer,
    turnPressed: ctx.turn,
  }
  G.bungaBtn = btn;
  EndTurn(G, ctx);
}

function SetEvent(G, ctx, k) {
  G.event = k;
}
function EndTurn(G,ctx) {
  G.event = '';
  G.cardDrawn = false;
  ctx.events.endTurn();
}

function hasEnded(G,ctx) {
  return G.bungaBtn.pressed && G.bungaBtn.pressedBy === ctx.currentPlayer && G.bungaBtn.turnPressed < ctx.turn;
}