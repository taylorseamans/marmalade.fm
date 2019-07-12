/*global Mixcloud*/
import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import FeaturedMix from './FeaturedMix';
import  Header from './Header';
import Home from './Home';
import Archive from './Archive';
import About from './About';

// We import our mix
import mixesData from '../data/mixes';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      currentMix: '',
      mixIds: mixesData,
      mix: null,
      mixes: []
    };
  }

  fetchMixes = async() => {

    const {mixIds} = this.state;

    mixIds.map(async id => {
      try {
      const response = await fetch(
        `https://api.mixcloud.com${id}`
      );
      const data = await response.json();

      // put the mix into our state
      this.setState((prevState, props) => ({
          mixes: [...prevState.mixes, data]
      }))

    } catch (error) {
      console.log(error);
    }
    })
    
  }

  mountAudio = async () => {
    // this keyword allows the widget to be accessible
    // anywhere inside the component
    this.widget = Mixcloud.PlayerWidget(this.player);
    await this.widget.ready;

    this.widget.events.pause.on(() => 
      this.setState({
        playing: false
      })
    );

    this.widget.events.play.on(() => 
      this.setState({
        playing: true
      })
    );
  };

  componentDidMount() {
    // when component is all mounted, then we all the audio
    this.mountAudio();
    this.fetchMixes();
  }

  actions = {
    // we group our methods into an object called actions
    togglePlay: () => {
    // we want to toggle play widget
    this.widget.togglePlay();
    },

    playMix: mixName => {
      // if mix name is same as currently playing, 
      // we want to puase it instead
      const {currentMix} = this.state
      if (mixName === currentMix) {
        // when code sees return statement it stops here
        return this.widget.togglePlay();
      }

      // update currentMix in our state
      this.setState({
        currentMix: mixName
      })
      
      // load a new mix then start playing it immediately
      this.widget.load(mixName, true);
    }
  }


  render() {

    // if array is empty we assign it default value of {}
    const [firstMix = {}] = this.state.mixes;

    return (
      // Router wraps our whole page and lets us use react-router
      <Router>
      <div>
        <div className='flex-l justify-end'>
          {/* FeaturedMix */}
          <FeaturedMix {...this.state} {...this.actions} {...firstMix} id={firstMix.key} />

          <div className='w-50-l relative z-1'>
          {/* Header */}
          <Header />


          {/* RoutedPage */}
          <Route exact path='/' render={() => <Home {...this.state} {...this.actions} />}/>
          <Route path='/archive' render={() => <Archive {...this.state} {...this.actions} />}/>
          <Route path='/about' render={() => <About {...this.state} />}/>
          </div>
        </div>
        

      {/* AudioPlayer */}
      <iframe width="100%" height="60" src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2Fdjplaturn%2Fthe-best-of-a-tribe-called-quest-v1%2F" frameBorder="0"  className='player db fixed bottom-0 z-5' ref={player => (this.player = player)}></iframe>
      </div>
      </Router>
    );
  }
}

export default App;
