import React, { Component } from 'react';
import { Text } from 'react-native';
import { View, List, ListItem, Left, Body } from 'native-base';
import styles from './SearchResultsStyles.js';
import RNGooglePlaces from 'react-native-google-places';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const SearchResults = ({ predictions, getSelectedAddress }) => {
    console.log("SearchResults")
    console.log(getSelectedAddress);
    
    function handleSelectedAdress(placeID){
        getSelectedAddress(placeID)
    }

    // RNGooglePlaces.openAutocompleteModal()
    // .then((place) => {
	// 	console.log(place);
	// 	// place represents user's selection from the
	// 	// suggestions and it is a simplified Google Place object.
    // })
    // .catch(error => console.log(error.message));  // error is a Javascript Error object

    return (
        <View style={styles.searchResultsWrapper}>
            <List
                dataArray={predictions}
                renderRow={(item) => 
                      <View>
                      <ListItem onPress={()=>handleSelectedAdress(item.placeID)} button avatar>
                        <Left style={styles.leftContainer}>
                            <Icon style={styles.leftIcon} name="location-on" />
                        </Left>
                        <Body>
                            <Text style={styles.primaryText}>{item.primaryText}</Text>
                            <Text style={styles.secondaryText}>{item.secondaryText}</Text>
                        </Body>
                      </ListItem>
                      </View>  
                    }
                />
        </View>
    );    
    
};

export default SearchResults;