import React, { Component } from 'react';
import {View, Text} from 'react-native';
import { Container } from 'native-base';
import MapContainer from './MapContainer';
import  HeaderComponent from '../../../components/HeaderComponent';
import FooterComponent from '../../../components/FooterComponent';
import Geolocation from 'react-native-geolocation-service';
import Fare from './Fare';

const vehicleLogo = require("../../../assets/img/octocat.png")
export default class Home extends Component {
    componentDidMount(){
        this.props.setName();
        this.props.getCurrentLocation();
    }

    // componentDidMount() {
    //     // Instead of navigator.geolocation, just use Geolocation.
          
    //         Geolocation.getCurrentPosition(
    //             (position) => {
    //                 console.log(position);
    //             },
    //             (error) => {
    //                 // See error code charts below.
    //                 console.log(error.code, error.message);
    //             },
    //             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    //         );
        
    // }
    render(){
        const region = { 
            latitude:3.146642,
            longitude:101.695845,
            latitudeDelta:0.0922,
            longitudeDelta:0.0421
        }
        // console.log("Homee")
        // console.log(this.props.predictions)
        return (
            // <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            //     {/* <Text>Hello World! {this.props.name}</Text> */}
            //     <MapContainer region={region}/>
            // </View>
            <Container>
                {/* <Text>Hello World! {this.props.name}</Text> */}
                <HeaderComponent logo={vehicleLogo} />
                {this.props.region.latitude && 
                    <MapContainer 
                        region={this.props.region} 
                        getInputData={this.props.getInputData} 
                        toggleSearchResultmodal={this.props.toggleSearchResultmodal} 
                        getAddressPredictions={this.props.getAddressPredictions}
                        resultTypes={this.props.resultTypes}
                        predictions={this.props.predictions}
                        getSelectedAddress={this.props.getSelectedAddress}
                        selectedAddress={this.props.selectedAddress}
                    />
                }

                {
                    this.props.fare &&
                    <Fare fare={this.props.fare} />
                }

                <FooterComponent/>
            </Container>
        );    
    }
}