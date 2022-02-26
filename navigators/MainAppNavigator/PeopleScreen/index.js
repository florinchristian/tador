import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Dimensions,
    Platform,
    ActivityIndicator,
    PermissionsAndroid,
    Linking,
    Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import LoadingPeople from '../../../components/LoadingPeople';
import PersonView from '../../../components/PersonView';

import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

import styles from './styles';

import axios from 'axios';
import { getUniqueId } from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';

import { appendToBlacklistPath, createRequestPath, fetchUsersPath, HOST, lookupUserForPeoplesViewPath, fetchRequestsPath, changeModePath, clearRequestsPath, deleteRequestPath } from '../../../constants';
import { peopleTestData } from '../../../testdata';

import SelectModeModal from '../../../components/SelectModeModal';

import { RFPercentage } from 'react-native-responsive-fontsize';
import FilterSettingsModal from '../../../components/FilterSettingsModal';

import AsyncStorage from '@react-native-async-storage/async-storage';
import InAppReview from 'react-native-in-app-review';

const PeopleScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);

    const [buttonTitle, setButtonTitle] = useState('Tador');

    const [users, setUsers] = useState([]);
    const [index, setIndex] = useState(0);

    const [modeModalVisible, setModeModalVisible] = useState(false);
    const [currentMode, setCurrentMode] = useState('dating');

    const [currentPosition, setCurrentPosition] = useState(null);

    const [preferredGender, setPreferredGender] = useState(null);

    const [filterModalVisible, setFilterModalVisible] = useState(false);

    const [nearbyDate, setNearbyDate] = useState(false);
    const [nearbyDtf, setNearbyDtf] = useState(false);
    const [nearbyFwb, setNearbyFwb] = useState(false);

    const [filterAux, setFilterAux] = useState(1);

    const titlesDict = {
        'dating': 'Date',
        'dtf': 'DTF',
        'fwb': 'FWB',
        'friends': 'New friends',
        'sexting': 'Sexting'
    };

    const saveFilters = (gender, date, dtf, fwb) => {
        setNearbyDate(date);
        setNearbyDtf(dtf);
        setNearbyFwb(fwb);
        setPreferredGender(gender);

        setFilterModalVisible(false);

        fetchUsers(currentMode, currentPosition, gender, {
            date: date,
            dtf: dtf,
            fwb: fwb
        });
    };

    const goToReportScreen = userId => {
        navigation.navigate('ReportUserScreen', {
            userId: userId
        });
    };

    const updateMode = async newMode => {
        if (newMode == currentMode) {
            setModeModalVisible(false);
            return;
        }

        const result = await axios.put(`http://${HOST}/${changeModePath}`, {
            userId: getUniqueId(),
            newMode: newMode
        });

        const response = result.data;

        setCurrentMode(newMode);
        setButtonTitle(titlesDict[newMode]);
        setModeModalVisible(false);

        fetchUsers(newMode, currentPosition, preferredGender, {
            date: nearbyDate,
            dtf: nearbyDtf,
            fwb: nearbyFwb
        });
    };

    const advanceList = async sign => {
        try {
            let targetUserId = users[index].userId;

            if (sign == 1) {
                await axios.post(`http://${HOST}/${createRequestPath}`, {
                    userId: getUniqueId(),
                    targetUserId: targetUserId
                });
            }

            await axios.post(`http://${HOST}/${appendToBlacklistPath}`, {
                userId: getUniqueId(),
                targetUserId: targetUserId
            });

            let newIndex = index + 1;

            if (newIndex == users.length) {
                fetchUsers(currentMode, currentPosition, preferredGender, {
                    date: nearbyDate,
                    dtf: nearbyDtf,
                    fwb: nearbyFwb
                });
            } else setIndex(newIndex);
        } catch (err) {
            console.log('no users to advance');
        }
    };

    const checkMode = (seekingMode, filters) => {
        return (seekingMode == 'dating' && filters.date)
            || (seekingMode == 'fwb' && filters.fwb)
            || (seekingMode == 'dtf' && filters.dtf);
    };

    const fetchUsers = async (seekingMode, position, gender, filters) => {
        setLoading(true);

        if (checkMode(seekingMode, filters) && position == null) {
            setUsers([]);
            setLoading(false);
            setCurrentPosition(null);
            return;
        }

        if (position == null) {
            position = {
                'coords': {
                    'latitude': 0,
                    'longitude': 0
                }
            };
        }

        try {
            const result = await axios.get(`http://${HOST}/${fetchUsersPath}`, {
                params: {
                    asUserId: getUniqueId(),
                    seekingMode: seekingMode,
                    preferredGender: gender,
                    position: {
                        x: position.coords.latitude,
                        y: position.coords.longitude
                    },
                    userFilters: {
                        date: filters.date,
                        dtf: filters.dtf,
                        fwb: filters.fwb
                    }
                }
            });

            setIndex(0);
            setUsers(result.data);

            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const loadUserInfo = async () => {
        const result = await axios.get(`http://${HOST}/${lookupUserForPeoplesViewPath}`, {
            params: {
                userId: getUniqueId()
            }
        });

        const data = result.data['data'];

        setCurrentMode(data['seeking']);
        setButtonTitle(titlesDict[data['seeking']]);
        setPreferredGender(data['preferredGender']);

        const date = data['considerDateLocation'] == 1 ? true : false;
        const dtf = data['considerDtfLocation'] == 1 ? true : false;
        const fwb = data['considerFwbLocation'] == 1 ? true : false;

        setNearbyDate(date);
        setNearbyDtf(dtf);
        setNearbyFwb(fwb);

        setFilterAux(filterAux * -1);

        var permission = null;

        if (Platform.OS == 'ios') {
            permission = await Geolocation.requestAuthorization('whenInUse');
        } else {
            permission = 'granted';

            const permissions = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
            ], {
                title: "Tador Location Permission",
                message:
                    "Tador needs access to your location " +
                    "so you can see people around.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            });

            for (let key in permissions) {
                if (permissions[key] != 'granted') {
                    permission = 'forbidden';
                }
            }
        }

        if (permission == 'granted') {
            Geolocation.getCurrentPosition(async position => {
                setCurrentPosition(position);
                fetchUsers(data['seeking'], position, data['preferredGender'], {
                    date: date,
                    dtf: dtf,
                    fwb: fwb
                });
            }, error => {
                fetchUsers(data['seeking'], null, data['prefferedGender'], {
                    date: date,
                    dtf: dtf,
                    fwb: fwb
                });
            }, {
                enableHighAccuracy: true,
                showLocationDialog: true
            });
        } else fetchUsers(data['seeking'], null, data['preferredGender'], {
            date: date,
            dtf: dtf,
            fwb: fwb
        });

        checkStorage();
    };

    const showReview = async () => {
        if (InAppReview.isAvailable()) {
            try {
                const result = await InAppReview.RequestInAppReview();

                if (result) {
                    await AsyncStorage.setItem('reviewCounter', String(21));
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    const checkStorage = async () => {
        const instaShown = await AsyncStorage.getItem('instaShown');

        console.log(instaShown);

        if (instaShown == null) {
            Alert.alert(
                'Stay Tuned!', 
                'You can follow me on @florinchristian.dev to find out about the latest news about Tador!',
                [
                    {
                        text: 'Ok',
                        style: 'cancel',
                        onPress: () => Linking.openURL('https://www.instagram.com/florinchristian.dev/')
                    },
                    {
                        text: 'Dismiss',
                        style: 'destructive',
                        onPress: () => {}
                    }
                ]
            )

            await AsyncStorage.setItem('instaShown', 'shown');
        }

        const reviewCounter = await AsyncStorage.getItem('reviewCounter');

        console.log(reviewCounter);

        if (reviewCounter == null) {
            await AsyncStorage.setItem('reviewCounter', String(1));
        } else {
            let count = parseInt(reviewCounter);

            if (count == 20) {
                showReview();
            } else {
                if (count < 20)
                    await AsyncStorage.setItem('reviewCounter', String(count + 1));
            }
        }
    };

    useEffect(() => {
        loadUserInfo();
    }, []);

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#f907fc', '#05d6d9']}
            style={{
                flex: 1,
            }}
        >
            <SafeAreaView style={{
                flex: 1,
                justifyContent: 'space-evenly'
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20
                }}>
                    <TouchableOpacity onPress={() => setModeModalVisible(true)} style={{
                        flexDirection: 'row'
                    }}>
                        <Text style={styles.title}>{buttonTitle}</Text>

                        <Fontisto
                            style={{
                                alignSelf: 'center',
                                marginStart: 10
                            }}
                            name='angle-down'
                            color={'white'}
                            size={RFPercentage(3)}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        setFilterModalVisible(true);
                    }} style={{
                        alignSelf: 'center'
                    }}>
                        <Ionicons
                            name='ios-settings-outline'
                            color={'white'}
                            size={RFPercentage(5)}
                        />
                    </TouchableOpacity>
                </View>

                <SelectModeModal
                    visible={modeModalVisible}
                    selected={currentMode}
                    updateChoice={newValue => updateMode(newValue)}
                />

                <FilterSettingsModal
                    toggle={filterAux}
                    visible={filterModalVisible}
                    genderValue={preferredGender}
                    dateValue={nearbyDate}
                    dtfValue={nearbyDtf}
                    fwbValue={nearbyFwb}
                    saveFilters={saveFilters}
                    closeModal={() => {
                        setFilterModalVisible(false);
                    }}
                />

                {users.length ? (
                    <PersonView
                        images={users[index].images}
                        onReportPress={() => goToReportScreen(users[index].userId)}
                    />
                ) : (
                    <View style={{
                        backgroundColor: 'white',
                        width: WIDTH * 80 / 100,
                        height: HEIGHT * 58 / 100,
                        borderRadius: 20,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {loading ? (
                            <ActivityIndicator
                                size={'large'}
                                color={'gray'}
                            />
                        ) : (
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                {(currentPosition == null && checkMode(currentMode, {
                                    date: nearbyDate,
                                    dtf: nearbyDtf,
                                    fwb: nearbyFwb
                                })) ? (
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: RFPercentage(3.2)
                                        }}>Location needed.</Text>
                                        <Text style={{
                                            color: 'gray'
                                        }}>Enable location access in your settings</Text>
                                    </View>
                                ) : (
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{
                                            fontSize: RFPercentage(3.2),
                                            color: 'black'
                                        }}>There are no more users.</Text>

                                        <TouchableOpacity onPress={() => setModeModalVisible(true)} activeOpacity={0.5} style={styles.continueBtn}>
                                            <Text style={{
                                                fontSize: RFPercentage(2.6),
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}>Change your seeking mode</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                )}

                <View style={{
                    width: '100%',
                    height: HEIGHT * 8 / 100,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={() => advanceList(-1)} activeOpacity={0.7} style={{
                        width: HEIGHT * 8 / 100,
                        height: HEIGHT * 8 / 100,
                        borderRadius: HEIGHT * 8 / 200,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            color: 'black',
                            fontSize: RFPercentage(3)
                        }}>❌</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => advanceList(1)} activeOpacity={0.7} style={{
                        width: HEIGHT * 8 / 100,
                        height: HEIGHT * 8 / 100,
                        borderRadius: HEIGHT * 8 / 200,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            color: 'black',
                            fontSize: RFPercentage(3.8)
                        }}>🔥</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {Platform.OS == 'ios' ? (
                <StatusBar barStyle='light-content' />
            ) : (
                <StatusBar translucent backgroundColor={'transparent'} barStyle='light-content' />
            )}
        </LinearGradient>
    );
};

export default PeopleScreen;