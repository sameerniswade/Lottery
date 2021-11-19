import "./App.css";
import web3 from "./web3";
import { Component } from "react";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "you have been entered!" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "waiting on transaction success..." });
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({ message: "winner has been picked!" });
  };

  render() {
    return (
      <div className="lottery">
        <div className="card">
          <h2 className="header">Lottery</h2>
          <p className="manager-text">This contract is manage by</p>
          <p className="manager">{this.state.manager}</p>
          <div className="people-money">
            <div className="people">
              <p className="people-text">Participant</p>
              <p className="people-value">{this.state.players.length}</p>
            </div>
            <div className="money">
              <p className="money-text">Winning Amount</p>
              <p className="money-value">
                {web3.utils.fromWei(this.state.balance, "ether")} ether
              </p>
            </div>
          </div>

          <hr />

          <form onSubmit={this.onSubmit}>
            <h4 className="form-header">Want a try your luck?</h4>
            <div>
              <label className="form-text">Amount of ether to enter</label>
              <input
                type="number"
                placeholder="minimum 0.01 ether!"
                className="form-input"
                value={this.state.value}
                onChange={(event) =>
                  this.setState({ value: event.target.value })
                }
              />
            </div>
            <button className="form-button">Enter</button>
          </form>

          <hr />

          <h1 className="msg">{this.state.message}</h1>

          <hr />
          <div className="pick">
            <h4 className="pick-text">Ready to pick winner?</h4>
            <button className="pick-button" onClick={this.onClick}>
              pick a winner!
            </button>
          </div>
          <hr />
        </div>
      </div>
    );
  }
}

export default App;
