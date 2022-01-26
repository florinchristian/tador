import React, { useState } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    TextInput
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Entypo from 'react-native-vector-icons/Entypo';

import { RFPercentage } from 'react-native-responsive-fontsize';

const ChangeSnapchatScreen = ({ navigation, route }) => {
    const [isValid, setIsValid] = useState(false);
    const [value, setValue] = useState('');

    const { updateValue } = route.params;

    const validInput = newInput => {
        let ok = true;

        if (newInput.length < 3) ok = false;
        if (newInput.indexOf(' ') != -1) ok = false;

        setIsValid(ok);
    };

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.5 }}
            colors={['#f907fc', '#05d6d9']}
            style={{
                flex: 1
            }}
        >
            <SafeAreaView style={{
                flex: 1,
                justifyContent: 'flex-end'
            }}>
                <Text style={{
                    fontSize: RFPercentage(4.5),
                    color: 'white',
                    fontWeight: 'bold',
                    marginLeft: 10
                }}>Change Snapchat</Text>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    style={{
                        width: '100%',
                        height: '70%',
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
                            StatusBar.setBarStyle('dark-content', true);
                            navigation.goBack();
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
                        }}>Enter your new Snapchat</Text>
                    </View>

                    <View style={{
                        flex: 1,
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}>
                        <TextInput
                            placeholder='New Snapchat'
                            placeholderTextColor='#C0C0C0'
                            style={[{
                                borderBottomWidth: 1,
                                borderBottomColor: 'gray',
                                padding: 5,
                                fontSize: RFPercentage(3.5),
                                fontWeight: 'bold'
                            }, {
                                width: '70%'
                            }]}
                            value={value}
                            onChangeText={newValue => {
                                setValue(newValue);
                                validInput(newValue);
                            }}
                            autoCapitalize='none'
                            autoCorrect={false}
                            spellCheck={false}
                        />

                        <TouchableOpacity onPress={() => {
                            updateValue(value);
                            navigation.goBack();
                        }} style={{
                            backgroundColor: '#05d6d9',
                            borderRadius: 50,
                            shadowColor: 'gray',
                            shadowOffset: {
                                width: 0,
                                height: 0
                            },
                            shadowOpacity: 0.3,
                            shadowRadius: 5,
                            elevation: 5
                        }}>
                            <Text style={{
                                fontSize: RFPercentage(3.3),
                                color: 'white',
                                paddingHorizontal: 25,
                                paddingVertical: 10
                            }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default ChangeSnapchatScreen;