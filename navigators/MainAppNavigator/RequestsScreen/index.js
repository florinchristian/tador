import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    ScrollView,
    Dimensions,
    FlatList,
    Image,
    StatusBar,
    Alert,
    Linking
} from 'react-native';
import PersonViewModal from '../../../components/PersonViewModal';

import { RFPercentage } from 'react-native-responsive-fontsize';

import { HOST, fetchRequestsPath, loadImagePath, clearRequestsPath, deleteRequestPath } from '../../../constants';

import { getUniqueId } from 'react-native-device-info';
import { getAgeFromDate } from '../../../tools';

import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';

const RequestItem = ({ userId, snapchat, birthdate, gender, seeking, onImagePress, onDeletePress, onAddPress }) => {
    const imgSize = 70;

    return (
        <View style={{
            width: '100%'
        }}>
            <View style={{
                width: '100%',
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

const RequestsScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);

    const [personModalVisible, setPersonModalVisible] = useState(false);
    const [currentPersonImages, setCurrentPersonImages] = useState([]);
    const [currentUserId, setCurrentUserId] = useState('');

    const goToReportScreen = userId => {
        setPersonModalVisible(false);
        StatusBar.setBarStyle('light-content');
        navigation.navigate('ReportUserScreen', {
            userId: userId
        });
    };

    const clearRequests = () => {
        axios.delete(`http://${HOST}/${clearRequestsPath}`, {
            params: {
                userId: getUniqueId()
            }
        }).then(result => setRequests([]));
    };

    const removeRequest = async userId => {
        await axios.delete(`http://${HOST}/${deleteRequestPath}`, {
            params: {
                userId: getUniqueId(),
                senderUserId: userId
            }
        });

        let newRequests = requests.filter(item => item.userId != userId);

        if (newRequests.length == 0) {
            fetchRequests();
        } else setRequests(newRequests);
    };

    const fetchRequests = async () => {
        setLoading(true);

        const result = await axios.get(`http://${HOST}/${fetchRequestsPath}`, {
            params: {
                userId: getUniqueId()
            }
        });

        const response = result.data;

        if (response.success) {
            setRequests(response.data);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'white'
        }}>
            <PersonViewModal
                onReportPress={() => {
                    goToReportScreen(currentUserId);
                }}
                visible={personModalVisible}
                closeModal={() => setPersonModalVisible(false)}
                images={currentPersonImages}
            />

            <View style={{
                backgroundColor: 'white',
                width: '100%',
                height: RFPercentage(6),
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomColor: '#DCDCDC',
                borderBottomWidth: 1
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
                    color: 'black',
                    fontSize: RFPercentage(3)
                }}>Requests</Text>
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
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={fetchRequests}
                                />
                            }
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
                                    onAddPress={async () => {
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
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={fetchRequests}
                                />
                            }
                            style={{
                                flex: 1
                            }}
                        >
                            <View style={{
                                width: Dimensions.get('screen').width,
                                height: Dimensions.get('screen').height / 1.25,
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

                                <Text style={{
                                    textAlign: 'center',
                                    color: 'gray',
                                    marginVertical: 10
                                }}>
                                    Pull down to refresh
                                </Text>
                            </View>
                        </ScrollView>
                    )}
                </View>
            )}
        </SafeAreaView>
    );
};

export default RequestsScreen;