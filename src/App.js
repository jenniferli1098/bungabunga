//import { Local } from 'boardgame.io/multiplayer';
import TicTacToe from './Game';
import TicTacToeBoard from './Board';


import React from "react";
import { render } from "react-dom";
import { Client } from "boardgame.io/react";
import Bunga from "./Game";
import BungaBungaBoard from "./Board";
import { SocketIO } from 'boardgame.io/multiplayer'
import { Local } from 'boardgame.io/multiplayer';

import logger from 'redux-logger';
import { applyMiddleware, compose } from 'redux';

const BungaBungaClient = Client({
  game: Bunga,
  board: BungaBungaBoard,
  numPlayers: 4,
  multiplayer: SocketIO({ server: 'localhost:8000' }),
  //enhancer: applyMiddleware(logger),
  // enhancer: (
  //   window.__REDUX_DEVTOOLS_EXTENSION__
  //   && window.__REDUX_DEVTOOLS_EXTENSION__()
  // ),
  enhancer: compose(
    applyMiddleware(logger),
    (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  ),

});


// const App = () => (
//   <div>
//     <TicTacToeClient playerID="0" />
//     <TicTacToeClient playerID="1" />
//   </div>
// );



class App extends React.Component {
  state = { playerID: null };

  render() {
    if (this.state.playerID === null) {
      return (
        <div>
          <p>Play as</p>
          <button onClick={() => this.setState({ playerID: "0" })}>
            Player 0
          </button>
          <button onClick={() => this.setState({ playerID: "1" })}>
            Player 1
          </button>
          <button onClick={() => this.setState({ playerID: "2" })}>
            Player 2
          </button>
          <button onClick={() => this.setState({ playerID: "3" })}>
            Player 3
          </button>
        </div>
      );
    }
    return (
      <div>
        <BungaBungaClient playerID={this.state.playerID} /> 
      </div>
    );
  }
}

export default App;