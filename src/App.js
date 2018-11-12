import React, { Component } from 'react';
import './components/model.js'
import './components/bootstrap.min.css'
import './App.css';

function generateID() {
    return Math.random().toString(36).substr(2, 9);
}

function removeInputValue() {
    let inputDiv = document.getElementsByClassName('form-control');
    for (var i = 0; i < inputDiv.length; i++) {
       inputDiv[i].value = '';
    }
}

function inputValidation(email, password) {
    if (email && password) {
        return true;
    } else {
        if (!email) {
            generateError('email', 'Введите email');
        }

        if (!password) {
            generateError('password', 'Введите пароль');
        }

        return false;
    }
}

function generateError(type, comment) {
    if (type === 'email') {
        emailError(comment);
    }

    if (type === 'password') {
        passwordError(comment);
    }

    if (type === 'reg') {
        emailError(comment);
        passwordError();
    }

    function emailError(comment) {
        let input = document.getElementById('inputEmail');
        let small = document.getElementById('emailHelp');

        input.classList.add('is-invalid');
        small.className = 'invalid-feedback';
        small.innerHTML = comment;
    }

    function passwordError(comment) {
        let input = document.getElementById('inputPassword');
        let small = document.getElementById('passwordHelp');

        input.classList.add('is-invalid');
        small.className = 'invalid-feedback';
        if (comment) small.innerHTML = comment;
    }
}

function removeError(target) {
    if (target.id === 'inputEmail') {
        emailError();
    }

    if (target.id === 'inputPassword') {
        passwordError();
    }

    if (target.id === 'regBtn') {
        emailError();
        passwordError();
    }

    if (target.id === 'backBtn') {
        emailError();
        passwordError();
    }

    function emailError() {
        try {
            let input = document.getElementById('inputEmail');
            let small = document.getElementById('emailHelp');

            input.classList.remove('is-invalid');
            small.className = 'form-text text-muted';
            small.innerHTML = 'Я предположу, что вы введёте email, но вообще этой версии программы введите что-то и @ знак собачки :)';
        } catch(e) {
            console.log(e);
        }
    }

    function passwordError() {
        try {
            let input = document.getElementById('inputPassword');
            let small = document.getElementById('passwordHelp');
            
            input.classList.remove('is-invalid');
            small.className = 'form-text text-muted';
            small.innerHTML = '';
        } catch(e) {
            console.log(e);
        }  
    }

}

class App extends Component {
    constructor() {
        super();

        this.state = {
            page: 'login',
            inputEmail: '',
            inputPassword: '',
            inputName: ''
        }

        this.pressStartBtn = this.pressStartBtn.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }


    pressStartBtn(event) {
        let btn, email, password, name, users;
        try {
            btn = event.target.id;
            email = this.state.inputEmail;
            password = this.state.inputPassword;
            name = this.state.inputName || 'ПользовательБезИмени';
            users = localStorage.users ? JSON.parse(localStorage.users) : [];
        } catch(e) {
            console.log('changePage() error');
            console.log(e);
        }

        if (btn === 'loginBtn') {
            if (inputValidation(email, password)) {
                if (users.length ===! 0) {
                    users.forEach(user => {
                        if (user.email === email && user.password === password) {
                            this.setState({
                                page: 'main'
                            })
                        } else {
                            generateError('reg', 'Такое сочитание логина и пароля не зарегистрировано')
                        }
                    })
                } else {
                    generateError('reg', 'Такое сочитание логина и пароля не зарегистрировано')
                }
            }
        }

        if (btn === 'regBtn') {
            this.setState({
                page: 'reg'
            });
            removeInputValue();
            removeError(event.target);
        }

        if (btn === 'backBtn') {
            this.setState({
                page: 'login'
            })
            removeError(event.target);
        }

        if (btn === 'regOn') {
            let user = {
                name: name,
                email: email,
                password: password,
                id: generateID()
            }

            if (inputValidation(email, password)) {
                console.log('here')
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));

                this.setState({
                    page: 'main',
                    inputEmail: '',
                    inputPassword: '',
                    inputName: '' 
                });
            }
        }
    }

    inputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const id = target.id;

        removeError(target);

        this.setState({
            [id]: value
        });
    }

    render() {
        let toReturn;
        let page = this.state.page;

        if (page === 'login') {
            toReturn = <form id="startForm">
                <fieldset>
                    <legend>Ваша учётная запись</legend>
                    <div className="form-group" id="emailGroup">
                        <label htmlFor="inputEmail" className="form-control-label">Email</label>
                        <input type="email" onChange={this.inputChange} className="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Введите адрес електронной почты"></input>
                        <small id="emailHelp" className="form-text text-muted">Я предположу, что вы введёте email, но вообще этой версии программы введите что-то и @ знак собачки :)</small>
                    </div>
                    <div className="form-group" id="passwordGroup">
                        <label htmlFor="inputPassword" className="form-control-label">Пароль</label>
                        <input type="password" onChange={this.inputChange} className="form-control" id="inputPassword" placeholder="Пароль"></input>
                        <small id="passwordHelp" className="form-text text-muted"></small>
                    </div>
                    <button type="button" form="startForm" className="btn btn-primary" id="loginBtn" onClick={this.pressStartBtn}>Войти</button>
                    <button type="button" className="btn btn-outline-primary" id="regBtn" onClick={this.pressStartBtn}>Регистрация</button>
                </fieldset>
            </form>;
        }

        if (page === 'reg') {
            toReturn = <form id="regForm">
                <fieldset>
                    <legend>Регистрация нового пользователя</legend>
                    <div className="form-group" id="emailGroup">
                        <label htmlFor="inputName">Имя</label>
                        <input type="text" onChange={this.inputChange} className="form-control" id="inputName" placeholder="Ваше имя"></input>
                        <small id="nameHelp" className="form-text text-muted"></small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputEmail">Email</label>
                        <input type="email" onChange={this.inputChange} className="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Введите адрес електронной почты"></input>
                        <small id="emailHelp" className="form-text text-muted">Я предположу, что вы введёте email, но вообще этой версии программы всё равно что вы введёте :)</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputPassword">Пароль</label>
                        <input type="password" onChange={this.inputChange} className="form-control" id="inputPassword" placeholder="Пароль"></input>
                        <small id="passwordHelp" className="form-text text-muted"></small>
                    </div>
                    <button type="button" className="btn btn-outline-primary" id="backBtn" onClick={this.pressStartBtn}>Обратно</button>
                    <button type="button" form="regForm" className="btn btn-primary" id="regOn" onClick={this.pressStartBtn}>Зарегистрироваться</button>
                </fieldset>
            </form>;
        }

        return (
            <div>
                {toReturn}
            </div>
        );
    }
}

export default App;
