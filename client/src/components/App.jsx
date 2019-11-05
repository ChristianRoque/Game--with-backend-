import React, { Component } from 'react';
import { Route, Link, NavLink, Switch } from 'react-router-dom';
import api from '../api';
import Title from '../components/Title';

export default class App extends Component {
	state = {};

	render() {
		return (
			<div className="App">
				<h1>Did i break this?</h1>
				<Title />
			</div>
		);
	}
}
