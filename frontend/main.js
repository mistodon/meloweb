import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { compile_melo_to_base64 } from "melo";
import { playerFromMIDIBuffer } from "hackmidi";
import { toByteArray } from "base64-js";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: null,
      inputSource: "",
      outputBase64: "",
    };
  }

  async handleInput(event) {
    const input = event.target.value;
    this.setState({ inputSource: input });

    try {
      const compileResult = await compile_melo_to_base64(input);
      this.setState({ outputBase64: compileResult });
    }
    catch (error) {
      this.setState({ outputBase64: "WebAssembly error." });
    }
  }

  async play() {
    if (this.state.player !== null) {
      this.state.player.pause();
    }
    const bytes = toByteArray(this.state.outputBase64);
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

    return <div>
      <textarea
        placeholder="Type Melo code here..."
        className="melo-input"
        value={ this.state.inputSource }
        onInput={ (e) => this.handleInput(e) }>
      </textarea>
      <input type="text" value={ this.state.outputBase64 } readOnly/>
      <button className="melo-button" onClick={ () => this.play() }>Play</button>
      <button className="melo-button" onClick={ () => this.stop() }>Stop</button>
      <a download="example.mid" href={ downloadUrl } target="_blank">Download</a>
    </div>;
  }
}


function initialize(domId, samplesUrl) {
  var node = document.getElementById(domId);
  ReactDOM.render(<App samplesUrl={ samplesUrl } />, node);
}


window.meloUi = { initialize };
