import React, { useState } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Linking
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Entypo from 'react-native-vector-icons/Entypo';

import { RFPercentage } from 'react-native-responsive-fontsize';

import axios from 'axios';
import { HOST, reportUserPath } from '../../../constants';

const ReportUserScreen = ({ navigation, route }) => {
    const [value, setValue] = useState('');

    const { userId } = route.params;

    const goBack = () => {
        StatusBar.setBarStyle('light-content', true);
        navigation.goBack();
    };

    const sendReport = async () => {
        if (value.length == 0) return;

        const result = await axios.post(`http://${HOST}/${reportUserPath}`, {
            userId: userId,
            body: value
        });

        goBack();
    };

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#f907fc', '#05d6d9']}
            style={{
                flex: 1
            }}
        >
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{
                flex: 1,
                justifyContent: 'flex-end'
            }}>
                <Text style={{
                    fontSize: RFPercentage(4.5),
                    color: 'white',
                    fontWeight: 'bold',
                    marginLeft: 10
                }}>Report user</Text>

                <View
                    style={{
                        width: '100%',
                        height: '80%',
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20
                    }}>
                    <View style={{
                        width: '100%',
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        padding: 15
                    }}>
                        <TouchableOpacity onPress={() => {
                            goBack();
                        }} style={{
                            position: 'absolute',
                            left: 10
                        }}>
                            <Entypo
                                name='chevron-left'
                                size={30}
                                color='black'
                            />
                        </TouchableOpacity>

                        <Text style={{
                            fontSize: RFPercentage(2.7),
                            color: 'black'
                        }}></Text>
                    </View>

                    <View style={{
                        flex: 1
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                color: 'black'
                            }}>
                                Describe below how this user breaks our
                            </Text>
                            <TouchableOpacity onPress={() => {
                                Linking.openURL('https://app.termly.io/document/terms-of-use-for-ios-app/93d37dda-74a6-4bc3-896e-f9ecbe233884');
                            }} activeOpacity={0.7}>
                                <Text style={{
                                    color: '#1E90FF',
                                    fontStyle: 'italic'
                                }}>
                                    Terms and Conditions
                                </Text>
                            </TouchableOpacity>
                            <Text>:</Text>
                        </View>

                        <TextInput 
                            multiline
                            value={value}
                            onChangeText={newValue => setValue(newValue)}
                            maxLength={200}
                            placeholder='For example: Fake account, underage, etc...'
                            style={{
                                flex: 1,
                                backgroundColor: '#F5F5F5',
                                margin: 20,
                                borderRadius: 20,
                                paddingHorizontal: 10,
                                paddingTop: 10,
                                paddingBottom: 10
                            }}
                        />

                        <TouchableOpacity onPress={() => {
                            sendReport();
                        }} style={{
                            backgroundColor: '#05d6d9',
                            borderRadius: 10,
                            shadowColor: 'gray',
                            shadowOffset: {
                                width: 0,
                                height: 0
                            },
                            shadowOpacity: 0.3,
                            shadowRadius: 5,
                            elevation: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginHorizontal: 20,
                            marginBottom: 20
                        }}>
                            <Text style={{
                                fontSize: RFPercentage(3.3),
                                color: 'white',
                                paddingHorizontal: 25,
                                paddingVertical: 10
                            }}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

export default ReportUserScreen;