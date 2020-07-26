import React from 'react';

import PropTypes from 'prop-types';

import './Board.css';

class BungaBungaBoard extends React.Component {
  

  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    playerID: PropTypes.string,
    isActive: PropTypes.bool,
    isMultiplayer: PropTypes.bool,
    isConnected: PropTypes.bool,
    isPreview: PropTypes.bool,
  };

  draw() {this.props.moves.DrawCard(); }
  endTurn() {this.props.moves.EndTurn(); }
  bungaBunga() {this.props.moves.BungaBunga();}
  playCard() {this.props.moves.PlayCard();}
  clickableBB() {return this.props.G.bungaBtn.pressed || this.props.G.cardDrawn;}
  clickableDC() {return this.props.G.cardDrawn;}

  isActive() {
    return this.props.isActive;
  }
  isOwn(id){
   return this.props.ctx.currentPlayer === ''+id;
  }

  //this detemines if the card is clickable
  clickable(playerID) {
    //console.log(this.props.G.bungaBtn.pressedBy + " "+ playerID);
    if(this.props.G.bungaBtn.pressedBy === '' + playerID) {return true;}
    var clickable = true;
    //not the player's cards
    switch(this.props.G.event) {
      //own cards
      case 'peek':
      case 'swap2':
        clickable = this.isOwn(playerID);
        break;
      //other people's cards
      case 'lookswap':
      case 'spy':
      case 'swap':
        clickable = !this.isOwn(playerID);
        break;

      case 'draw':
        clickable = this.isOwn(playerID);
        break;
      default:
        clickable = this.isOwn(playerID);
        break;
    }
    return !(this.isActive() && clickable);
  }

  //this determines what function is called
  cardClicked(playerId, key) {
    //alert(playerId + key);
    //console.log(event.target);
    switch(this.props.G.event) {
      case 'swap':
        alert('swap');
        //store first card
        //this.props.G.card1 ={playerId,key};
        this.props.G.card1.playerId = playerId;
        this.props.G.card1.key = key;
        console.log(this.props.G.card1);
        this.props.moves.SetEvent('swap2');
        //this.props.G.event = 'swap2';
        break;
      case 'swap2':
        this.props.G.card2.playerId = playerId;
        this.props.G.card2.key = key;
        this.props.moves.Swap();
        this.props.moves.EndTurn();

        break;
      case 'draw':
        this.props.moves.KeepCard(key);
        break;
      case 'spy':
        alert('spy');
        this.props.G.peekCard.playerId = playerId;
        this.props.G.peekCard.key = key;
        console.log(this.props.G.peekCard);
        this.props.moves.FaceUp();
        setTimeout(() => {
          this.props.moves.FaceDown();
        }, 1000);
        //show cards;
        break;
      case 'peek':
        alert('peek');
        this.props.G.peekCard.playerId = playerId;
        this.props.G.peekCard.key = key;
        this.props.moves.FaceUp();
        setTimeout(() => {
          this.props.moves.FaceDown();
        }, 1000);
        break;

      case 'lookswap':
        alert('lookswap');
        this.props.G.peekCard.playerId = playerId;
        this.props.G.peekCard.key = key;
        console.log(this.props.G.peekCard);
        this.props.moves.FaceUp();
        setTimeout(() => {
          this.props.moves.FaceDown();
          this.props.moves.EndTurn();
        }, 1000);


        this.props.moves.SetEvent('swap');
        break;

      default:
        this.props.moves.KeepCard(key);
    }
  }
  render() {
    let winner = '';
    if (this.props.ctx.gameover) {
      winner =
        this.props.ctx.gameover.winner !== undefined ? (
          <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
        ) : (
          <div id="winner">Draw!</div>
        );
    }

    const cellStyle = {
      border: '1px solid #555',
      width: '50px',
      height: '50px',
      lineHeight: '50px',
      textAlign: 'center',
    };

    const currentCard = () => {
      if(this.props!== undefined && !this.isActive(this.props.playerID)){return "";}
      if(this.props.G.currentCard.num === undefined) {return "";}
      
      return this.props.G.currentCard.num+this.props.G.currentCard.suit;
      
    }

    const discardPile = () => {
      if(this.props.G.discarded.length === 0) {return "";}
      
      return this.props.G.discarded[this.props.G.discarded.length - 1].num+this.props.G.discarded[this.props.G.discarded.length - 1].suit;
      
    }
    // const player = this.props.G.cardValue[0].map(num =>{
    //   return (
    //     <div>num {' '} </div>
    //   )
    // });
    //this.props.ctx.cardValue = [0,0];

    const display = (card) => {
      
      //card not vidible and player not active
      if(card.faceUp && this.isActive(this.props.playerID)){return card.num + card.suit;}
      
      return "";
    }

    return (
      <div>
          <div>
              <p>Player 1:</p> {this.props.G.cardValue[0].map((card,key) =>{return (<button disabled={this.clickable(0)} onClick={() => this.cardClicked(0,key)} > {display(card)}{' '}</button>)})}
              
              <p>Player 2:</p> {this.props.G.cardValue[1].map((card,key) =>{return (<button disabled={this.clickable(1)} onClick={() => this.cardClicked(1,key)} > {display(card)}{' '}</button>)})}
              <p>Player 3:</p> {this.props.G.cardValue[2].map((card,key) =>{return (<button disabled={this.clickable(2)} onClick={() => this.cardClicked(2,key)} > {display(card)}{' '}</button>)})}
              <p>Player 4:</p> {this.props.G.cardValue[3].map((card,key) =>{return (<button disabled={this.clickable(3)} onClick={() => this.cardClicked(3,key)} > {display(card)}{' '}</button>)})}

              
          </div>
          <br></br>
          Current Card <button>{currentCard()}</button>

          <br></br>
          Discarded Card <button disabled={currentCard() === ''} onClick={() =>this.playCard()}>{discardPile()}</button>
          <div>
            <button disabled={this.clickableDC()} onClick={() => this.draw()}>Draw card</button>
            <button onClick={() => this.endTurn()}>End turn</button>
            <button disabled={this.clickableBB()} onClick={() => this.bungaBunga()}>Bunga Bunga</button>
              {winner}
          </div>
      </div>
    );
  }
}

export default BungaBungaBoard;