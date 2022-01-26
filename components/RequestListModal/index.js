import React, { useState, useEffect} from 'react';
import {
    Modal,
    Animated,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Linking,
    Alert
} from 'react-native';

import PersonViewModal from '../PersonViewModal';

import axios from 'axios';
import { HOST, loadImagePath } from '../../constants';
import { getUniqueId } from 'react-native-device-info';
import { requestsTestData } from '../../testdata';
import { getAgeFromDate } from '../../tools';

import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { RFPercentage } from 'react-native-responsive-fontsize';

const RequestItem = ({ userId, snapchat, birthdate, gender, seeking, onImagePress, onDeletePress, onAddPress }) => {
    const imgSize = 70;

    return (
        <View style={{
            width: '100%'
        }}>
            <View style={{
                width: '100',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <TouchableOpacity activeOpacity={0.7} onPress={onImagePress}>
                    <Image
                        source={{
                            uri: `http://${HOST}/${loadImagePath}?userId=${userId}&index=0`
                        }}
                        style={{
                            width: imgSize,
                            height: imgSize,
                            borderRadius: imgSize / 2,
                            marginHorizontal: 20
                        }}
                    />
                </TouchableOpacity>

                <Text style={{
                    fontSize: RFPercentage(2.7)
                }}>{snapchat} • {getAgeFromDate(new Date(birthdate))}</Text>

                <Text style={{
                    color: 'gray'
                }}>{gender}, into {seeking}</Text>
            </View>

            <View style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingVertical: 10,
                borderBottomColor: '#C0C0C0',
                borderBottomWidth: 0.5
            }}>
                <TouchableOpacity onPress={onDeletePress} style={{
                    backgroundColor: 'red',
                    borderRadius: 10,
                    width: '40%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: RFPercentage(2.3),
                        padding: 10,
                        fontWeight: 'bold'
                    }}>Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onAddPress} style={{
                    backgroundColor: '#f7f017',
                    borderRadius: 10,
                    width: '40%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        color: 'black',
                        fontSize: RFPercentage(2.3),
                        textAlign: 'center',
                        padding: 10,
                        fontWeight: 'bold'
                    }}>Add on Snapchat</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const HEIGHT = Dimensions.get('screen').height;

const animDuration = 300;

const RequestListModal = ({ onReportPress, visible, requests, loading, closeModal, removeRequest, clearRequests }) => {
    const [personModalVisible, setPersonModalVisible] = useState(false);
    const [currentPersonImages, setCurrentPersonImages] = useState([]);
    const [currentUserId, setCurrentUserId] = useState('');

    const backgroundIndex = new Animated.Value(0.0);
    const backColor = backgroundIndex.interpolate({
        inputRange: [0.0, 0.3],
        outputRange: ['rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 0.3)']
    });

    const formBottom = new Animated.Value(-HEIGHT * 60 / 100);

    const fadeIn = () => {
        Animated.parallel([
            Animated.timing(backgroundIndex, {
                toValue: 0.3,
                duration: animDuration,
                useNativeDriver: false
            }),
            Animated.timing(formBottom, {
                toValue: 0,
                duration: animDuration,
                useNativeDriver: false
            })
        ]).start();
    };

    const fadeOut = () => {
        Animated.parallel([
            Animated.timing(backgroundIndex, {
                toValue: 0.0,
                duration: animDuration,
                useNativeDriver: false
            }),
            Animated.timing(formBottom, {
                toValue: -HEIGHT * 60 / 100,
                duration: animDuration,
                useNativeDriver: false
            })
        ]).start(closeModal);
    };

    return (
        <Modal
            transparent
            onShow={fadeIn}
            animationType='none'
            visible={visible}
        >
            <PersonViewModal
                onReportPress={() => {
                    onReportPress(currentUserId);
                }}
                visible={personModalVisible}
                closeModal={() => setPersonModalVisible(false)}
                images={currentPersonImages}
            />

            <Animated.View
                style={{
                    flex: 1,
                    backgroundColor: backColor
                }}
            >
                <Animated.View
                    style={{
                        width: '100%',
                        height: HEIGHT * 60 / 100,
                        backgroundColor: 'white',
                        position: 'absolute',
                        bottom: formBottom,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        shadowColor: 'gray',
                        shadowOffset: {
                            width: 0,
                            height: 0
                        },
                        shadowOpacity: 1,
                        shadowRadius: 5,
                        elevation: 5
                    }}
                >
                    <View style={{
                        width: '100%',
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity onPress={() => {
                            Alert.alert(
                                'Delete all requests',
                                'Are you sure you want to erase all pending requests?',
                                [
                                    {
                                        text: 'Cancel',
                                        onPress: () => { }
                                    },
                                    {
                                        text: 'Delete',
                                        style: 'destructive',
                                        onPress: () => clearRequests()
                                    }
                                ]
                            );
                        }} style={{
                            position: 'absolute',
                            left: 20
                        }}>
                            <Entypo
                                name='trash'
                                color={'red'}
                                size={RFPercentage(3.3)}
                            />
                        </TouchableOpacity>

                        <Text style={{
                            fontSize: RFPercentage(2.7),
                            color: 'black'
                        }}>Requests</Text>

                        <TouchableOpacity onPress={fadeOut} style={{
                            position: 'absolute',
                            right: 20
                        }}>
                            <AntDesign
                                name='close'
                                color={'gray'}
                                size={RFPercentage(3.3)}
                            />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <ActivityIndicator
                                size={'large'}
                            />
                        </View>
                    ) : (
                        <View style={{
                            flex: 1
                        }}>
                            {requests.length ? (
                                <FlatList
                                    data={requests}
                                    keyExtractor={item => item.userId}
                                    style={{
                                        flex: 1
                                    }}
                                    renderItem={({ item }) => (
                                        <RequestItem
                                            userId={item.userId}
                                            snapchat={item.snapchat}
                                            birthdate={item.birthdate}
                                            seeking={item.seeking}
                                            gender={item.gender}
                                            onImagePress={() => {
                                                setCurrentPersonImages(item.images);
                                                setCurrentUserId(item.userId);
                                                setPersonModalVisible(true);
                                            }}
                                            onDeletePress={() => removeRequest(item.userId)}
                                            onAddPress={ async () => {
                                                const snapchat = item.snapchat;

                                                if (await Linking.canOpenURL(`snapchat://add/${snapchat}`)) {
                                                    Linking.openURL(`snapchat://add/${snapchat}`);
                                                } else {
                                                    Linking.openURL(`https://www.snapchat.com/add/${snapchat}`);
                                                }

                                            }}
                                        />
                                    )}
                                />
                            ) : (
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{
                                        fontSize: RFPercentage(2.7),
                                        textAlign: 'center',
                                        color: 'black'
                                    }}>
                                        You have no requests!
                                        {'\n'}
                                        Try uploading new and shiny pictures!
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

export default RequestListModal;