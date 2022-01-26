import React, { useState } from 'react';
import {
    View,
    Dimensions,
    StatusBar,
    Text,
    ScrollView,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Linking
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { getUniqueId } from 'react-native-device-info';

import Entypo from 'react-native-vector-icons/Entypo';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import styles from './styles';

import GenderForm from '../GenderForm';
import SeekingForm from '../SeekingForm';
import PhotosForm from '../PhotosForm';
import BirthdateForm from '../BirthdateForm';
import UploadDataView from '../UploadDataView';

import { HOST, registerPath } from '../../constants';
import SnapchatForm from '../SnapchatForm';

import {RFPercentage} from 'react-native-responsive-fontsize';

const RegisterScreen = ({changeParentComponentIndex}) => {
    const [currentTitle, setTitle] = useState("Select your gender");
    const [showBackButton, setShowBackButton] = useState(false);
    const [tosAccepted, setTosAccepted] = useState(false);

    const [ownGender, setOwnGender] = useState('male');
    const [ownSeeking, setOwnSeeking] = useState('dating');
    const [currentBirthdate, setBirthdate] = useState(new Date());
    const [currentPhotos, setCurrentPhotos] = useState([]);
    const [snapchat, setSnapchat] = useState('');

    const [scrollViewRef, setScrollViewRef] = useState(null);
    const [slideIndex, setSlideIndex] = useState(1);

    const titles = {
        1: 'Select your gender',
        2: 'When were you born',
        3: 'What are you seeking',
        4: 'Upload your best pics',
        5: 'Let users get in touch with you',
        6: 'Creating your account'
    };

    const showTos = () => {
        Linking.openURL('https://app.termly.io/document/terms-of-use-for-ios-app/93d37dda-74a6-4bc3-896e-f9ecbe233884');
    };

    const showPrivacyPolicy =  () => {
        Linking.openURL('https://app.termly.io/document/privacy-policy/0f972ef8-3dee-4cb5-8330-333954e3596b');
    };

    const slide = sign => {
        if (sign == -1) {
            Keyboard.dismiss()
        }

        let index = slideIndex + 1 * sign;

        if (index > 1 && index != 6) setShowBackButton(true);
        else setShowBackButton(false);

        setTitle(titles[index]);
        setSlideIndex(index);

        scrollViewRef.scrollTo({
            x: WIDTH * (index - 1),
            animated: true
        });
    }

    const seek = sign => {
        if (slideIndex == 1) {
            if (!tosAccepted)
                Alert.alert(
                    'Terms and Conditions & Privacy Policy Agreement',
                    'By proceeding, you agree to our Terms and Conditions & Privacy Policy.',
                    [
                        {
                            text: 'Agree',
                            onPress: () => {
                                setTosAccepted(true);
                                slide(1);
                            }
                        },
                        {
                            text: 'View Terms and Conditions',
                            onPress: showTos
                        },
                        {
                            text: 'View Privacy Policy',
                            onPress: showPrivacyPolicy
                        },
                        {
                            text: 'Cancel',
                            onPress: () => { },
                            style: 'destructive'
                        }
                    ]
                );
            else slide(1);
        } else slide(sign);
    }

    const uploadData = async () => {
        const data = new FormData();

        for (let i in currentPhotos) {
            data.append('userImages', {
                uri: currentPhotos[i],
                type: 'image/png',
                name: 'thefuqisthat'
            });
        }

        const userInfo = {
            'userId': getUniqueId(),
            'gender': ownGender,
            'seeking': ownSeeking,
            'birthdate': currentBirthdate.toJSON(),
            'snapchat': snapchat
        };

        for (let i in userInfo) {
            data.append(i, userInfo[i]);
        }

        const result = await axios.post(`http://${HOST}/${registerPath}`, data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        });

        if (result.data['success']) {
            changeParentComponentIndex(3);
        } else {
            
        }
    };

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.5 }}
            colors={['#f907fc', '#05d6d9']}
            style={styles.container}
        >
            <KeyboardAvoidingView
                style={{
                    width: '100%'
                }}
                behavior={Platform.OS === "ios" ? "padding" : null}
            >
                <Text style={{
                    color: 'white',
                    fontSize: RFPercentage(7.3),
                    fontWeight: 'bold',
                    marginLeft: 10
                }}>Welcome</Text>

                <View style={{
                    width: '100%',
                    height: HEIGHT * 50 / 100,
                    backgroundColor: 'white',
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                }}>
                    <View style={{
                        width: '100%',
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        padding: 15
                    }}>
                        {showBackButton ? (
                            <TouchableOpacity onPress={() => slide(-1)} style={{
                                position: 'absolute',
                                left: 10
                            }}>
                                <Entypo
                                    name='chevron-left'
                                    size={30}
                                    color='black'
                                />
                            </TouchableOpacity>
                        ) : null}

                        <Text style={{
                            fontSize: RFPercentage(3),
                            color: 'black'
                        }}>{currentTitle}</Text>
                    </View>

                    <ScrollView ref={ref => setScrollViewRef(ref)} style={{
                        flex: 1
                    }} scrollEnabled={false} horizontal showsHorizontalScrollIndicator={false}>
                        <GenderForm onContinue={() => seek(1)} selected={ownGender} updateChoice={setOwnGender} />
                        <BirthdateForm onContinue={() => seek(1)} currentBirthdate={currentBirthdate} updateBirthdate={setBirthdate} />
                        <SeekingForm onContinue={() => seek(1)} selected={ownSeeking} updateChoice={setOwnSeeking} />
                        <PhotosForm onContinue={() => seek(1)} currentPhotos={currentPhotos} updatePhotos={setCurrentPhotos} />
                        <SnapchatForm onContinue={() => {
                            uploadData();
                            seek(1);
                        }} currentSnapchat={snapchat} updateSnapchat={setSnapchat} />
                        <UploadDataView />
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>

            {Platform.OS == 'ios' ? (
                <StatusBar barStyle='light-content' />
            ) : (
                <StatusBar translucent backgroundColor={'transparent'} barStyle='light-content' />
            )}
        </LinearGradient>
    );
};

export default RegisterScreen;