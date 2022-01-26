import React from 'react';
import {
    View,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import styles from './styles';

const UploadDataView = () => {
    return (
        <View style={{flex: 1}}>
            <View style={[styles.container, {
                width: Dimensions.get('screen').width
            }]}>
                <ActivityIndicator 
                    size={'large'}
                    color={'gray'}
                />
            </View>
        </View>
    );
};

export default UploadDataView;