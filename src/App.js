import React, { Component } from "react";
import Moment from 'react-moment';
import "./App.scss";

class App extends Component {
  constructor() {
    super();

    let today = new Date()
    let curHr = today.getHours()

    let getDayTime;

    if (curHr < 12) {
      getDayTime = true
    } else {
      getDayTime = false
    }

    this.state = {
      apiMessage: "",
      isToggleOn: false,
      isHover: false,
      loading: false,
      getDayTime: getDayTime,
      city: "",
      countryCode: "",
      userData: {},
      randomQuote: {}
    };

    this.generateRandomQuote = this.generateRandomQuote.bind(this);
    this.toggleInfos = this.toggleInfos.bind(this);
    this.hoverBtn = this.hoverBtn.bind(this);
  }

  componentDidMount() {
    this.setState({loading: true})
    fetch("https://api.quotable.io/random")
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }})
      .then(data => {
        this.setState({
          loading: false,
          randomQuote: data
      })
    })   

    fetch('https://freegeoip.app/json/')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }})
        .then(data => {
          console.log(data)
          this.setState({
            city: data.city,
            countryCode: data.country_code
          })

	  return fetch('http://worldtimeapi.org/api/ip/' + data.ip);

    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    }).then(userData => {
      this.setState({
        userData: userData
      })
    }).catch(error => {
      this.setState({
        apiMessage: 'It look like the API worldtimeapi kinda sucks please give another try to get dynamic datas and reload the page OR stay and get hard coded datas...'
      })
    });
  }

  generateRandomQuote() {
    fetch("https://api.quotable.io/random")
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }})
      .then(data => {
        this.setState({
          randomQuote: data
      })
    })
  }

  toggleInfos() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  hoverBtn() {
    this.setState(state => ({
      isHover: !state.isHover
    }));
  }
  
  render() {
    return (
      <section className="Container">
        <div className={`Row ${this.state.getDayTime ? 'Morning' : 'Evening'}`}>
          <div className="Content Main-info">
            <div className={`Content up ${this.state.isToggleOn ? 'hidden' : 'visible'}`}>
              <figure className="quote">
                <blockquote>{this.state.randomQuote.content}</blockquote>
                <figcaption>{this.state.randomQuote.author}</figcaption>
                </figure>
              <span className="refreshCta" onClick={this.generateRandomQuote}><svg width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M7.188 10.667a.208.208 0 01.147.355l-2.344 2.206a5.826 5.826 0 009.578-2.488l2.387.746A8.322 8.322 0 013.17 14.94l-2.149 2.022a.208.208 0 01-.355-.148v-6.148h6.52zm7.617-7.63L16.978.958a.208.208 0 01.355.146v6.23h-6.498a.208.208 0 01-.147-.356L13 4.765A5.825 5.825 0 003.43 7.26l-2.386-.746a8.32 8.32 0 0113.76-3.477z" fill="#FFF" fillRule="nonzero" opacity=".5"/></svg></span>
            </div>
            <div className="down">
              <div className="welcome-content">
                <h4>{ this.state.getDayTime ? 'Good Morning' : 'Good Evening' }<span className="hide-mobile">, it's currently</span></h4>
                <div className="time-content">
                  <h1>
                    <Moment format="hh:mm">
                      {this.state.userData.datetime}
                    </Moment>
                    <span>{this.state.userData.abbreviation ? this.state.userData.abbreviation : "EDT"}</span>
                  </h1>
                </div>
                <div className="location-content">
                  <h3>in {this.state.city ? this.state.city : "Montreal"}, {this.state.countryCode}</h3>
                </div>
              </div>
              <button className="btn-toggle" onClick={this.toggleInfos} onMouseEnter={this.hoverBtn} onMouseLeave={this.hoverBtn}><span className={this.state.isToggleOn ? 'active' : ''}>{this.state.isToggleOn ? 'Less' : 'More'}</span></button>
            </div>
          </div>

          <div className={`Content More-info ${this.state.isToggleOn ? 'visible' : 'hidden'} ${this.state.isHover ? 'hover' : ''}`}>
            <div className="More-Content">
              <div className="left-content">
                <div className="timezone">
                  <h6>Current timezone</h6>
                  <h2>{this.state.userData.timezone ? this.state.userData.timezone : "America/Toronto"}</h2>
                </div>
                <div className="day-of-year">
                  <h6>Day of the year</h6>
                  <h2>{this.state.userData.day_of_year ? this.state.userData.day_of_year : "130"}</h2>
                </div>
              </div>
              <div className="right-content">
                <div className="day-of-week">
                  <h6>Day of the week</h6>
                  <h2>{this.state.userData.day_of_week ? this.state.userData.day_of_week : "1"}</h2>
                </div>
                <div className="week-number">
                  <h6>Week number</h6>
                  <h2>{this.state.userData.week_number ? this.state.userData.week_number : "19"}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <i style={{color:"red"}}>{this.state.apiMessage}</i>
      </section>
    );
  }
}

export default App;
