import React from 'react';
import {
    Modal,
    Animated,
    View,
    Dimensions,
    SafeAreaView,
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native';

const WIDTH = Dimensions.get('screen').width;

import { RFPercentage } from 'react-native-responsive-fontsize';

const SeekItem = ({ title, innerValue, selected, onPress }) => {
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
                fontSize: RFPercentage(2.3),
                color: 'black'
            }}>{title}</Text>
        </TouchableOpacity>
    );
};

const animDuration = 300;

const SelectModeModal = ({ visible, selected, updateChoice }) => {
    const modalWidth = WIDTH * 70 / 100;

    const backgroundIndex = new Animated.Value(0.0);
    const backColor = backgroundIndex.interpolate({
        inputRange: [0.0, 0.3],
        outputRange: ['rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 0.3)']
    });

    const leftValue = new Animated.Value(-modalWidth);

    const fadeIn = () => {
        Animated.parallel([
            Animated.timing(backgroundIndex, {
                toValue: 0.3,
                duration: animDuration,
                useNativeDriver: false
            }),
            Animated.timing(leftValue, {
                toValue: 0,
                duration: animDuration,
                useNativeDriver: false
            })
        ]).start();
    };

    const fadeOut = newValue => {
        Animated.parallel([
            Animated.timing(backgroundIndex, {
                toValue: 0.0,
                duration: animDuration,
                useNativeDriver: false
            }),
            Animated.timing(leftValue, {
                toValue: -modalWidth,
                duration: animDuration,
                useNativeDriver: false
            })
        ]).start(() => updateChoice(newValue));
    };

    return (
        <Modal
            transparent
            onShow={fadeIn}
            visible={visible}
            animationType='none'
        >
            <Animated.View
                style={{
                    flex: 1,
                    backgroundColor: backColor
                }}
            >
                <TouchableOpacity activeOpacity={1} onPress={() => fadeOut(selected)} style={{
                    flex: 1
                }}>
                    <TouchableOpacity activeOpacity={1} style={{
                        height: '100%',
                        width: modalWidth,
                        position: 'absolute',
                        top: 0,
                    }}>
                        <Animated.View style={{
                            backgroundColor: 'white',
                            left: leftValue
                        }}>
                            <SafeAreaView style={{
                                height: '100%'
                            }}>
                                <Text style={{
                                    fontSize: RFPercentage(3.7),
                                    fontWeight: 'bold',
                                    width: '100%',
                                    textAlign: 'center',
                                    paddingBottom: 10,
                                    color: 'black'
                                }}>Select your interest</Text>

                                <ScrollView showsVerticalScrollIndicator={false} style={{
                                    flex: 1,
                                }}>
                                    <SeekItem selected={selected} title='Dating' innerValue='dating' onPress={value => fadeOut(value)} />
                                    <SeekItem selected={selected} title='DTF' innerValue='dtf' onPress={value => fadeOut(value)} />
                                    <SeekItem selected={selected} title='Friends with benefits' innerValue='fwb' onPress={value => fadeOut(value)} />
                                    <SeekItem selected={selected} title='Sexting' innerValue='sexting' onPress={value => fadeOut(value)} />
                                    <SeekItem selected={selected} title='New friends' innerValue='friends' onPress={value => fadeOut(value)} />
                                </ScrollView>
                            </SafeAreaView>
                        </Animated.View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Animated.View>
        </Modal>
    );
};

export default SelectModeModal;