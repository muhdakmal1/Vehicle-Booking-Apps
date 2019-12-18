import { Dimensions, PermissionsAndroid } from 'react-native';
import update from 'react-addons-update';
import constants from  './actionConstants';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';

import request from '../../../utils/request.js';
import calculateFare from '../../../utils/fareCalculator.js';

// ***************************
// Constants
// ***************************
const { 
    GET_CURRENT_LOCATION
    ,GET_INPUT
    ,SET_NAME
    ,TOGGLE_SEARCH_RESULT
    ,GET_ADDRESS_PREDICTIONS
    ,GET_SELECTED_ADDRESS
    ,GET_DISTANCE_MATRIX
    ,GET_FARE
} = constants;

const { width, height } = Dimensions.get("window");

const ASPECT_RATION = width / height;

const LATITUDE_DELTA = 0.0922;

const LONGITUDE_DELTA = ASPECT_RATION * LATITUDE_DELTA;

const granted = PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );

// ***************************
// Actions
// ***************************
export function getCurrentLocation(){
    return(dispatch)=>{
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Cool Photo App Camera Permission',
              message:
                'Cool Photo App needs access to your camera ' +
                'so you can take awesome pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
          } else {
            console.log('Camera permission denied');
          }
        Geolocation.getCurrentPosition(
            (position) => {
                dispatch({
                    type: GET_CURRENT_LOCATION,
                    payload: position
                });
                // console.log(position);
            },
            (error) => console.log(error.code, error.message),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    }
}

//GET USER INPUT
export function getInputData(payload){
    console.log(payload);
    return {
        type: GET_INPUT,
        payload
    }
}

//toggle search result modal
export function toggleSearchResultmodal(payload){
    // console.log(payload);
    return {
        type: TOGGLE_SEARCH_RESULT,
        payload
    }
}

//GET ADDRESSES FROM GOOGLE PLACE
export function getAddressPredictions(){
    console.log("getAddressPredictions");
	return(dispatch, store)=>{
		let userInput = store().home.resultTypes.pickUp ? store().home.inputData.pickUp : store().home.inputData.dropOff;
		RNGooglePlaces.getAutocompletePredictions(userInput,
			{
				country:"MY"
			}
		)
		.then((results)=>
			dispatch({
				type:GET_ADDRESS_PREDICTIONS,
				payload:results
			})
		)
		.catch((error)=> console.log(error.message));
	};
}

// get selected address

export function getSelectedAddress(payload){
    const dummyNumbers = {
        baseFare:0.4,
        timeRate:0.14,
        distanceRate:0.97,
        surge:1
    }

    return (dispatch, store) => {
        RNGooglePlaces.lookUpPlaceByID(payload)
        .then((results) => {
            dispatch({
                type:GET_SELECTED_ADDRESS,
                payload:results
            })
            // console.log("home: getSelectedAddress -> RNGooglePlaces.lookUpPlaceByID")
            // console.log(results)
        })
        .then(() => {
            //Get the distance and time
            // console.log("checking origin value")
            // console.log(store().home.selectedAddress.selectedPickUp.latitude);

            if(store().home.selectedAddress.selectedPickUp && store().home.selectedAddress.selectedDropOff){
                request.get("https://maps.googleapis.com/maps/api/distancematrix/json")
                .query({
                    origins:store().home.selectedAddress.selectedPickUp.location.latitude + "," + store().home.selectedAddress.selectedPickUp.location.longitude,
                    destinations:store().home.selectedAddress.selectedDropOff.location.latitude + "," + store().home.selectedAddress.selectedDropOff.location.longitude,
                    mode:"driving",
                    key:"AIzaSyCJBkt1R4qDcazZenQP54VoMcamV4n0_Ac"
                })
                .finish((error, res) => {
                    console.log("home: getSelectedAddress -> RNGooglePlaces.lookUpPlaceByID type:GET_DISTANCE_MATRIX")
                    console.log(res.body);
                    dispatch({
                        type:GET_DISTANCE_MATRIX,
                        payload:res.body
                    });
                });
            }
            setTimeout(function(){
                if(store().home.selectedAddress.selectedPickUp && store().home.selectedAddress.selectedDropOff){
                    const fare = calculateFare(
                        dummyNumbers.baseFare,
                        dummyNumbers.timeRate,
                        store().home.distanceMatrix.rows[0].elements[0].duration.value,
                        dummyNumbers.distanceRate,
                        store().home.distanceMatrix.rows[0].elements[0].distance.value,
                        dummyNumbers.surge,
                    );
                    dispatch({
                        type:GET_FARE,
                        payload:fare
                    })
                }
            },1000)
        })
        .catch((error) => console.log(error.message));
    }
}

// ***************************
// Actions Handler
// ***************************
function handlerGetCurrentLocation(state, action){
    return update(state, {
        region: {
            // $set:action.payload
            latitude:{
                $set:action.payload.coords.latitude
            },
            longitude:{
                $set:action.payload.coords.longitude
            },
            latitudeDelta:{
                $set:LATITUDE_DELTA
            },
            longitudeDelta:{
                $set:LONGITUDE_DELTA
            }
        }
    })
}

function handlerGetInputData(state, action){
    const {key, value} = action.payload;
    return update(state, {
        inputData:{
            [key]:{
                $set:value
            }
        }
    });
}

function handlerToggleSearchResult(state, action){
    if(action.payload === "pickUp"){
        return update(state, {
            resultTypes:{
                pickUp:{
                    $set:true,
                },
                dropOff:{
                    $set:false,
                }
            },
            predictions:{
                $set:[]
            }
        });
    }
    if(action.payload === "dropOff"){
        return update(state, {
            resultTypes:{
                pickUp:{
                    $set:false,
                },
                dropOff:{
                    $set:true,
                }
            },
            predictions:{
                $set:[]
            }
        });
    }
}

function handlerGetAddressPredictions(state, action){
    return update(state, {
        predictions:{
            $set:action.payload
        }
    })
}

function handlerGetSelectedAddress(state, action){
    let selectedTitle = state.resultTypes.pickUp ? "selectedPickUp" : "selectedDropOff"
    return update(state, {
        selectedAddress:{
            [selectedTitle]:{
                $set:action.payload
            }
        },
        resultTypes:{
            pickUp:{
                $set:false
            },
            dropOff:{
                $set:false
            }
        }
    })
}

function handlerGetDistanceMatrix(state, action){
    return update(state, {
        distanceMatrix:{
            $set:action.payload
        }
    })
}


function handlerGetFare(state, action){
    return update(state, {
        fare:{
            $set:action.payload
        }
    })
}

export function setName(){
    return {
        type:SET_NAME,
        payload:"Akmal"
    }
}

function handleSetName(state, action){
    return update(state, {
        name:{
            $set:action.payload
        }
    })
}

const ACTION_HANDLERS = {
    SET_NAME:handleSetName,
    GET_CURRENT_LOCATION:handlerGetCurrentLocation,
    GET_INPUT:handlerGetInputData,
    TOGGLE_SEARCH_RESULT:handlerToggleSearchResult,
    GET_ADDRESS_PREDICTIONS:handlerGetAddressPredictions,
    GET_SELECTED_ADDRESS:handlerGetSelectedAddress,
    GET_DISTANCE_MATRIX:handlerGetDistanceMatrix,
    GET_FARE:handlerGetFare
}

const initialState = {
    region:{},
    inputData:{},
    resultTypes:{},
    selectedAddress:{}
};

export function HomeReducer(state = initialState, action){
    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
}