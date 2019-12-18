import React from 'react';
import { Text, Image } from 'react-native';
import { Header, Left, Body, Right, Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './HeaderComponentStyles';

export const HeaderComponent = ({ logo }) => {
    return (
        <Header style={{backgroundColor:"white"}} iosBarStyle="light-content">
            <Left>
                <Button transparent>
                    <Icon name="bars" style={styles.icon} />
                </Button>
            </Left>
            <Body>
                {/* <Text style={styles.headerText}>Testing Map</Text> */}
                <Image resizeMode="contain" style={styles.logo} source={logo} />
            </Body>
            <Right>
                <Button transparent>
                    <Icon name="gift" style={styles.icon} />
                </Button>
            </Right>
        </Header>
    )
}

export default HeaderComponent;