import React from 'react';
import { View, Text } from 'native-base';
import MapView from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import SearchBox from '../SearchBox';
import SearchResults from '../SearchResults';

import styles from './MapContainerStyles';

export const MapContainer = ({
                                region, 
                                getInputData, 
                                toggleSearchResultmodal, 
                                getAddressPredictions, 
                                resultTypes,
                                predictions,
                                getSelectedAddress,
                                selectedAddress
                            }) => {
    // console.log("MapContainer");
    // console.log(predictions);
    // console.log("1");

    const { selectedPickUp, selectedDropOff } = selectedAddress || {}
    
    return (
        <View style={styles.container}>
            <MapView 
                provider={MapView.PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
            >
                <MapView.Marker 
                    coordinate={region}
                    pinColor="red"
                />
            </MapView>
            <SearchBox 
                getInputData={getInputData} 
                toggleSearchResultmodal={toggleSearchResultmodal} 
                getAddressPredictions={getAddressPredictions} 
                selectedAddress={selectedAddress}
            />
            { (resultTypes.pickUp || resultTypes.dropOff) &&
                <SearchResults predictions={predictions} getSelectedAddress={getSelectedAddress} />
            }
        </View>
    )
}

export default MapContainer;