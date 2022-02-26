import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

import styles from './styles';

import axios from 'axios';
import { changeSnapchatPath, deleteAccountPath, deleteImagePath, getUserSettingsPath, HOST, updatePreferredGenderPath, uploadImagePath } from '../../../constants';
import { getAgeFromDate } from '../../../tools';
import { getUniqueId } from 'react-native-device-info';

import { launchImageLibrary } from 'react-native-image-picker';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

import { RFPercentage } from 'react-native-responsive-fontsize';
import RadioSelector from '../../../components/RadioSelector';

import { useForceUpdate } from '../../../tools';

import RNExitApp from 'react-native-exit-app';

const UserImage = ({ source, onPress, showDelete }) => {
    const padding = 40;

    return (
        <View style={{
            width: WIDTH / 2 - padding,
            height: (WIDTH / 2 + 50),
            marginTop: 10
        }}>
            {showDelete ? (
                <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={{
                    position: 'absolute',
                    zIndex: 10,
                    top: -10,
                    right: -10
                }}>
                    <AntDesign
                        name='minuscircle'
                        color='red'
                        size={20}
                    />
                </TouchableOpacity>
            ) : null}
            <Image
                source={{ uri: source }}
                style={{
                    flex: 1,
                    borderRadius: 10
                }}
            />
        </View>
    );
};

const AddButton = ({ onPress }) => {
    const padding = 40;

    return (
        <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={{
            width: WIDTH / 2 - padding,
            height: (WIDTH / 2 + 50),
            marginTop: 10,
            backgroundColor: '#E8E8E8',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Feather
                name='plus-circle'
                color='#C0C0C0'
                size={RFPercentage(5)}
            />
        </TouchableOpacity>
    );
};

const Header = ({ pfp, snapchat, age }) => {
    return (
        <View style={{
            width: '100%'
        }}>
            <View style={{
                width: '100%',
                height: 200,
                backgroundColor: 'white',
                borderRadius: 10,
                shadowColor: 'gray',
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowOpacity: 0.5,
                shadowRadius: 3,
                alignItems: 'center',
                justifyContent: 'space-evenly'
            }}>
                <Image
                    source={{ uri: pfp }}
                    style={{
                        width: WIDTH * 25 / 100,
                        height: WIDTH * 25 / 100,
                        borderRadius: WIDTH * 25 / 200
                    }}
                />

                <Text style={{
                    fontSize: RFPercentage(3.5),
                    color: 'black'
                }}>{snapchat} • {age}</Text>
            </View>
        </View>
    );
};

const SettingsScreen = ({ navigation }) => {
    const [userImages, setUserImages] = useState([]);
    const [snapchat, setSnapchat] = useState('');
    const [canChangeSnapchat, setCanChangeSnapchat] = useState(false);
    const [birthdate, setBirthdate] = useState(new Date());

    const [preferredGender, setPreferredGender] = useState('male');

    const [aux, setAux] = useState(1);

    const updatePreferredGender = async newValue => {
        const result = await axios.put(`http:${HOST}/${updatePreferredGenderPath}`, {
            userId: getUniqueId(),
            newValue: newValue
        });

        setPreferredGender(newValue);
    };

    const updateSnapchat = async newValue => {
        const result = await axios.put(`http://${HOST}/${changeSnapchatPath}`, {
            userId: getUniqueId(),
            newSnapchat: newValue
        });

        const response = result.data;

        if (response.success) {
            setSnapchat(newValue);
            setCanChangeSnapchat(false);
        }
    };

    const getUserSettings = async () => {
        const results = await axios.get(`http://${HOST}/${getUserSettingsPath}`, {
            params: {
                userId: getUniqueId()
            }
        });

        const data = results.data;

        if (data.success) {
            setUserImages(data['data'].userImages);
            setSnapchat(data['data'].snapchat);
            setCanChangeSnapchat(data['data'].canChangeSnapchat);
            setBirthdate(new Date(data['data'].birthdate));
            setPreferredGender(data['data'].preferredGender);
        }
    };

    const uploadImage = async () => {
        const pickerResult = await launchImageLibrary({ mediaType: 'photo', quality: 0.7});

        if (!pickerResult.didCancel) {
            const data = new FormData();

            data.append('userId', getUniqueId());
            data.append('image', {
                uri: pickerResult.assets[0].uri,
                type: 'image/png',
                name: 'thefuqisthat'
            });

            const result = await axios.post(`http://${HOST}/${uploadImagePath}`, data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            });

            const response = result.data;

            console.log(response);

            if (response.success) {
                setUserImages(response['data'].userImages);
                setAux(aux * -1);
            }
        }
    };

    const deleteImage = async imgIndex => {
        const result = await axios.delete(`http://${HOST}/${deleteImagePath}`, {
            params: {
                userId: getUniqueId(),
                index: imgIndex
            }
        });

        const response = result.data;

        if (response.success) {
            let newImages = userImages.filter((item, index) => index != imgIndex);
            setUserImages(newImages);
            setAux(aux * -1);
        }
    };

    const renderUserImages = () => {
        let list = userImages.map((photoUrl, index) => {
            return (
                <UserImage
                    showDelete={userImages.length == 1 ? false : true}
                    key={photoUrl + String(2 * index)}
                    source={photoUrl}
                    onPress={() => deleteImage(index)}
                />
            );
        });

        if (list.length < 4) {
            list.push(<AddButton onPress={uploadImage} key={'addButton'} />);
        }

        return list;
    };

    const deleteAccount = () => {
        axios.delete(`http://${HOST}/${deleteAccountPath}`, {
            params: {
                userId: getUniqueId()
            }
        }).then(result => RNExitApp.exitApp());
    };


    useEffect(() => {
        getUserSettings();
    }, [aux]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} style={{
                flex: 1,
                padding: 25
            }}>
                <Header
                    pfp={userImages[0]}
                    snapchat={snapchat}
                    age={getAgeFromDate(birthdate)}
                />

                <View style={{
                    width: '100%',
                    marginTop: 20
                }}>
                    <Text style={{
                        textTransform: 'uppercase',
                        color: 'gray'
                    }}>Your photos</Text>

                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}>
                        {aux == -1 || aux == 1? (
                            renderUserImages()
                        ) : null}
                    </View>
                </View>

                {/* <RadioSelector
                    onValueChange={updatePreferredGender}
                    title={'Show me only'}
                    selectedValue={preferredGender}
                    possibleValues={
                        {
                            'male': 'Males',
                            'female': 'Females'
                        }
                    }
                /> */}

                {canChangeSnapchat ? (
                    <View>
                        <TouchableOpacity onPress={() => {
                            StatusBar.setBarStyle('light-content', true);
                            navigation.navigate('ChangeSnapchatScreen', {
                                updateValue: newValue => {
                                    updateSnapchat(newValue);
                                }
                            });
                        }} activeOpacity={0.5} style={{
                            width: '100%',
                            backgroundColor: 'white',
                            marginTop: 20,
                            padding: 15,
                            borderRadius: 12
                        }}>
                            <Text style={{
                                color: '#1E90FF',
                                fontSize: RFPercentage(2.7)
                            }}>Change Snapchat username</Text>
                        </TouchableOpacity>

                        <Text style={{
                            color: 'gray',
                            padding: 10,
                        }}>
                            You can change your Snapchat username only once.
                        </Text>
                    </View>
                ) : null}

                <TouchableOpacity onPress={() => {
                    Alert.alert('Delete Account', 'Are you sure you want to delete your account?', 
                        [
                            {
                                'text': 'Cancel',
                                onPress: () => {}
                            },
                            {
                                'text': 'Delete',
                                'style': 'destructive',
                                onPress: () => deleteAccount()
                            }
                        ]);
                }} activeOpacity={0.5} style={{
                    width: '100%',
                    backgroundColor: 'white',
                    marginTop: 20,
                    padding: 15,
                    borderRadius: 12
                }}>
                    <Text style={{
                        color: 'red',
                        fontSize: RFPercentage(2.7)
                    }}>Delete account</Text>
                </TouchableOpacity>

                <Text style={{
                    color: 'gray',
                    padding: 10,
                    marginBottom: 20
                }}>
                    All images and your data are going to be deleted.
                    {'\n'}
                    You can re-enter Tador whenever you want.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsScreen;