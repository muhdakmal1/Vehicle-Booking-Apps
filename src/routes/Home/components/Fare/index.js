import React, { Component } from 'react';
import { Text } from 'react-native';
import { View } from 'native-base';
import styles from './FareStyles';

export const Fare = ({fare})=>{
	return (
		<View style={styles.fareContainer}>
			<Text>
				<Text style={styles.fareText}> FARE: RM</Text> <Text style={styles.amount}>{fare}</Text>
			</Text>
			
		</View>

	);
}

export default  Fare;