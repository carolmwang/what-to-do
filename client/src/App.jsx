import React, { Component } from 'react';
import {
  fetchCities,
  getAllUserPosts,
  getAllCityPosts,
  getOneUserPost,
  fetchPOI,
  createPost,
}
  from './services/api';

import Header from './components/Header';
import HomePage from './components/HomePage';
import Login from './components/Login';
// import NewPost from './components/NewPost';
import City from './components/City';

const BASE_URL = process.env.REACT_APP_API_URL

// fetchCities()
//   .then(data => console.log(data));


// getAllUserPosts(3)
//   .then(data => console.log(data));

// getAllCityPosts(2623)
//   .then(data => console.log(data));

// getOneUserPost(3, 3)
//   .then(data => console.log(data));

// fetchPOI("city:186")
//   .then(data => console.log(data))

class App extends Component {
  constructor() {
    super();

    this.state = {
      city: {},
      cities: [],
      poi: [],
      content: '',
      poi_id: '',
      city_id: '',
      user_id: '',
      username: '',
      email: '',
      password: '',
      isLoggedIn: null,
      isEdit: false,
      selectedJuiceId: null,
      isRegister: false,
      currentView: 'HomePage'
    };
    this.logout = this.logout.bind(this)
    this.isLoggedIn = this.isLoggedIn.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.cancel = this.cancel.bind(this)
    this.showRegisterForm = this.showRegisterForm.bind(this)
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.randomCity = this.randomCity.bind(this)
  }

  // AUTH Functions 
  // references:
  // https://medium.com/@nick.hartunian/knock-jwt-auth-for-rails-api-create-react-app-6765192e295a
  // JZ react-rails-token-auth repo
  cancel() {
    this.setState({
      name: '',
      sugar: '',
      isEdit: false,
      selectedJuiceId: null,
    })
  }

  showRegisterForm() {
    this.setState({
      isRegister: true,
    })
  }

  register() {
    const url = `${BASE_URL}/users`
    const body = { "user": { "email": this.state.email, "password": this.state.password } }
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      mode: 'cors',
      body: JSON.stringify(body)
    }
    fetch(url, init)
      .then(res => res.json())
      .then(this.setState({
        isRegister: false,
      }))
      .catch(err => err.message)
  }

  login() {
    const url = `${BASE_URL}/user_token`;
    const body = { "auth": { "email": this.state.email, "password": this.state.password } }
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      mode: 'cors',
      body: JSON.stringify(body),
    }
    fetch(url, init)
      .then(res => res.json())
      .then(res => localStorage.setItem("jwt", res.jwt))
      .then(() => this.setState({
        isLoggedIn: true,
      }))
      .catch(err => console.log(err))
  }

  isLoggedIn() {
    const res = !!(localStorage.getItem("jwt"));
    this.setState({
      isLoggedIn: res,
    })
    return res;
  }

  logout() {
    localStorage.removeItem("jwt")
    this.setState({
      isLoggedIn: false,
      juices: [],
      name: "",
      email: "",
    })
  }
  // END OF AUTH

  componentDidMount() {
    // this.isLoggedIn()
    fetchCities()
      .then(data => this.setState({ cities: data.cities }))
    fetchPOI(this.state.city_id)
      .then(data => this.setState({ poi: data }))
  }
  //renders to the homepage (for logo)
  renderToHomePage() {
    this.setState({
      currentView: 'HomePage'
    })
  }

  // handles the random city view after user clicks the button from the HomePage
 randomCity(random_city) {
    async function poiCity() {
    let data = await(
      await(fetchPOI(random_city))).json();
      console.log(data)
    }
    console.log(poiCity());
    // await fetchPOI(random_city.city_id)
    //   .then(data => console.log(data))
      // .then(data => {
      //   this.setState({
      //     poi: data.data.places,
      //     city: random_city,
      //     city_id: random_city.data_id,
      //     currentView: `City`
      //   })
      // })
  }
  // randomCity(random_city) {
  //   async function poiCity() {
  //   let data = await(
  //     await(fetchPOI(random_city))).json();
  //     console.log(data)
  //   }
  //   console.log(poiCity());
  //   // await fetchPOI(random_city.city_id)
  //   //   .then(data => console.log(data))
  //     // .then(data => {
  //     //   this.setState({
  //     //     poi: data.data.places,
  //     //     city: random_city,
  //     //     city_id: random_city.data_id,
  //     //     currentView: `City`
  //     //   })
  //     // })
  // }

  // shows all POI for the chosen city
  poiCity() {
    fetchPOI(this.state.city_id)
      .then(data => {
        this.setState({
          poi: data.data.places
        })
      })
  }

  //handles form change events
  handleChange(ev) {
    ev.preventDefault();
    const { name, value } = ev.target;
    this.setState({
      [name]: value,
    })
  }

  // render views
  determineWhichToRender() {
    const { currentView, city, cities, content, poi_id, city_id, user_id, username, email, isLoggedIn } = this.state;

    switch (currentView) {
      case 'HomePage':
        return <HomePage
          city={city}
          cities={cities}
          randomCity={this.randomCity}
        // handleChange={this.handleChange}
        />

      // case 'NewPost':
      //   return <NewPost
      //     content={content}
      //     poi_id={poi_id}
      //     city_id={city_id}
      //     user_id={user_id}
      //     handleChange={this.handleChange}
      //     submitNew={this.submitNew}
      //     isLoggedIn={isLoggedIn}
      //   />

      case 'City':
        return <City />

      case 'Login':
        return <Login handleChange={this.handleChange}
          login={this.login}
          logout={this.logout}
          email={this.state.email}
          password={this.state.password}
          isRegister={this.state.isRegister}
          register={this.register}
        />
    }

  }

  render() {
    return (
      <div>
        <Header
          renderToHomePage={this.renderToHomePage}
          logout={this.logout}
          showRegisterForm={this.showRegisterForm} />
        {this.determineWhichToRender()}
      </div>
    );
  }
  // return (
  //   <div className="App">
  //     <Header 
  //     logout={this.logout} 
  //     create={this.create}
  //     showRegisterForm={this.showRegisterForm}
  //     />
  //     <div> {display} </div>
  //     <JuiceForm 
  //     handleChange={this.handleChange} 
  //     submitNew={this.submitNew} 
  //     name={this.state.name}
  //     sugar={this.state.sugar}
  //     isEdit={this.state.isEdit}
  //     id={this.state.selectedJuiceId}
  //     edit={this.edit}
  //     cancel={this.cancel}
  //     />
  //   </div>
  // );
}


export default App;