import React from 'react';
import {
    View,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import styles from './styles';

import TadorIcon from '../../assets/svg/TadorIcon.svg';

const WIDTH = Dimensions.get('screen').width;

const StartupScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.icon}>
                <TadorIcon width={WIDTH / 5} height={WIDTH / 5} />
            </View>

            <ActivityIndicator style={{
                marginVertical: 20
            }} size={"small"} color={'gray'}/>
        </View>
    );
}

export default StartupScreen;