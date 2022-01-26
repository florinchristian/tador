import React from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import styles from './styles';

import Feather from 'react-native-vector-icons/Feather';

import { RFPercentage } from 'react-native-responsive-fontsize';

const SeekItem = ({ title, innerValue, selected, onPress}) => {
    return (
        <TouchableOpacity onPress={() => onPress(innerValue)} activeOpacity={0.5} style={{
            width: '90%',
            backgroundColor: '#F5F5F5',
            paddingVertical: 20,
            borderRadius: 10,
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center'
        }}>
            <View style={{
                width: 25,
                height: 25,
                borderRadius: 12.5,
                borderWidth: 1.5,
                borderColor: (selected == innerValue) ? '#f907fc' : 'gray',
                marginHorizontal: 20,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {(selected == innerValue) ? (
                    <View style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: '#f907fc',
                        backgroundColor: '#f907fc'
                    }}></View>
                ) : null}
            </View>
            <Text style={{
                fontSize: RFPercentage(2.5),
                color: 'black'
            }}>{title}</Text>
        </TouchableOpacity>
    );
};

const SeekingForm = ({selected, updateChoice, onContinue}) => {
    return (
        <View style={{flex: 1}}>
            <ScrollView style={[styles.container, {
                width: Dimensions.get('screen').width
            }]}>
                <SeekItem selected={selected} title='Dating' innerValue='dating' onPress={updateChoice}/>
                <SeekItem selected={selected} title='DTF' innerValue='dtf' onPress={updateChoice}/>
                <SeekItem selected={selected} title='Friends with benefits' innerValue='fwb' onPress={updateChoice}/>
                <SeekItem selected={selected} title='Sexting' innerValue='sexting' onPress={updateChoice}/>
                <SeekItem selected={selected} title='New friends' innerValue='friends' onPress={updateChoice}/>
            </ScrollView>

            <TouchableOpacity onPress={onContinue} activeOpacity={0.5} style={styles.floatingContinueButton}>
                <Text style={{
                    fontSize: RFPercentage(3.5),
                    color: 'white',
                    marginLeft: 15
                }}>Continue</Text>

                <Feather
                    style={{
                        marginHorizontal: 10
                    }}
                    name='chevron-right'
                    color='white'
                    size={RFPercentage(3.5)}
                />
            </TouchableOpacity>
        </View>
    );
};

export default SeekingForm;