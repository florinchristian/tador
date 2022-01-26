import React from 'react';
import {
    View,
    StatusBar,
    Text
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { RFPercentage } from 'react-native-responsive-fontsize';

const BannedScreen = ({banReason}) => {
    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.5 }}
            colors={['#f907fc', '#05d6d9']}
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <View style={{
                width: '80%',
                height: '70%',
                backgroundColor: 'white',
                borderRadius: 20,
                shadowColor: 'gray',
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowOpacity: 1,
                shadowRadius: 10,
                elevation: 5,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <FontAwesome5 
                    name='door-closed'
                    color={'red'}
                    size={RFPercentage(10)}
                />

                <Text style={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: RFPercentage(4),
                    textAlign: 'center',
                    marginVertical: 30,
                    marginHorizontal: 20
                }}>You have been banned permanently.</Text>

                <Text style={{
                    color: 'gray',
                    textAlign: 'center',
                    fontSize: RFPercentage(3)
                }}>
                    Reason:
                    {'\n'}
                    {banReason}
                </Text>
            </View>

            <StatusBar translucent backgroundColor={'transparent'} barStyle='light-content'/>
        </LinearGradient>
    );
};

export default BannedScreen;