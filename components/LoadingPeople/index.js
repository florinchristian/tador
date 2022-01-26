import React from 'react';
import {
    View,
    Dimensions
} from 'react-native';

import styles from './styles';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const LoadingPeople = () => {
    return(
        <View style={{
            backgroundColor: 'white',
            width: WIDTH * 80/100,
            height: HEIGHT * 65/100,
            borderRadius: 20,
            alignSelf: 'center'
        }}>

        </View>
    );
};

export default LoadingPeople;