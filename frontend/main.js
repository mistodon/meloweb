import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { compile_melo_to_base64 } from "melo";
import { playerFromMIDIBuffer } from "hackmidi";
import { toByteArray } from "base64-js";


class Compiler {
  constructor() {
    this.nextId = 0;
  }

  compile(source, callback) {
    const id = this.nextId;
    this.nextId += 1;

    compile_melo_to_base64(source).then(base64 => {
      const succeeded = base64.substr(0, 4) === "TVRo";
      const response = {
        succeeded,
        id,
        output: base64,
      };
      callback(response);
    });

    return id;
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: null,
      inputSource: "",
      waitingForId: null,
      compiler: new Compiler(),
      compilationResult: null
    };
  }

  componentDidMount() {
    this.recompile("");
  }

  recompile(input) {
    const compilationId = this.state.compiler.compile(
      input,
      (result) => this.compilationEnded(result));

    this.setState({ inputSource: input, waitingForId: compilationId });
  }

  compilationEnded(result) {
    if (result.id === this.state.waitingForId) {
      this.setState({ compilationResult: result, waitingForId: null });
    }
  }


  async play() {
    if (this.state.player !== null) {
      this.state.player.pause();
    }
    const bytes = toByteArray(this.state.compilationResult.output);
    const player = await playerFromMIDIBuffer(bytes, this.props.samplesUrl);
    player.play();
    this.setState({ player });
  }

  async stop() {
    if (this.state.player !== null) {
      this.state.player.pause();
    }
    this.setState({ player: null });
  }


  render() {
    const downloadUrl = "data:audio/midi;base64," + this.state.outputBase64;
    const compiling = this.state.waitingForId !== null;
    const result = this.state.compilationResult;
    const succeeded = result !== null && result.succeeded;

    let message = "";
    if (compiling) { message = "Compiling..."; }
    else if (result && !succeeded) { message = "Compilation failed: " + result.output }

    const buttonDisabled = (succeeded && !compiling) ? "" : "disabled";

    return <div>
      <textarea
        placeholder="Type Melo code here..."
        className="melo-input"
        value={ this.state.inputSource }
        onInput={ (e) => this.recompile(e.target.value) }>
      </textarea>
      <div>
        <button className="melo-button" onClick={ () => this.play() } disabled={ buttonDisabled }>Play</button>
      </div>
      <div>
        <button className="melo-button" onClick={ () => this.stop() } disabled={ buttonDisabled }>Stop</button>
      </div>
      <div>
        <a download="example.mid" href={ downloadUrl } target="_blank">Download</a>
      </div>
      <div>
        { message }
      </div>
    </div>;
  }
}


function initialize(domId, samplesUrl) {
  var node = document.getElementById(domId);
  ReactDOM.render(<App samplesUrl={ samplesUrl } />, node);
}


window.meloUi = { initialize };
