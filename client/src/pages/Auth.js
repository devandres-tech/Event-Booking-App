import React, { Component } from 'react'

import './Auth.css';

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  state = {
    isLogin: true
  }

  onLoginClick = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    })
  }

  submitHandler = (e) => {
    e.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const requestBody = {
      query: `
        mutation {
          createUser(userInput: {email: "${email}", password: "${password}"}) {
            _Id
            email
          }
        }
      `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log('response is: ', resData)
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { isLogin } = this.state;
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button onClick={this.onLoginClick}>Switch to {isLogin ? 'Signup' : 'login'}</button>
        </div>
      </form>
    )
  }
}

export default AuthPage;