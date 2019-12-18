import React from "react";
import { View, Text } from "react-native";
import createStore from "./store/createStore";
import AppContainer from "./AppContainer";
export default class Root extends React.Component{
	renderApp(){
		const initialState = window.___INTITIAL_STATE__;
		const store = createStore(initialState);
		// console.log("test "+store);
		return (
			<AppContainer store={store} />
			// <View>
			// 	<Text>rrrr</Text>
			// </View>
		);

	}

	render(){
		return this.renderApp();
	}
}