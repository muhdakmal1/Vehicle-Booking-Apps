import React from 'react';
import { Text } from 'react-native';
import { Footer, FooterTab, Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './FooterComponentStyles';

export const FooterComponent = ({ logo }) => {
    
    //tab bar items
    const tabs = [{
        title:"Vehicle",
        subTitle:"",
        icon:"car"
    },
    {
        title:"Search",
        subTitle:"",
        icon:"search"
    },
    {
        title:"Info",
        subTitle:"",
        icon:"info"
    },
    {
        title:"History",
        subTitle:"",
        icon:"history"
    }
    ]

    return (
        <Footer>
            <FooterTab style={styles.footerContainer} iosBarStyle="light-content">
                {
                    tabs.map((obj, index) => {
                        return (
                            <Button key={index}>
                                <Icon size={20} name={obj.icon} style={{marginTop:10}} color={(index===0) ? "#FF5E3A" : "grey"} />
                                <Text style={{fontSize:12, color:(index===0) ? "#FF5E3A" : "#eee" }} >{obj.title}</Text>
                                <Text style={styles.subText}>{obj.subTitle}</Text>
                            </Button>
                        )
                    })
                }
            </FooterTab>
        </Footer>
    )
}

export default FooterComponent;