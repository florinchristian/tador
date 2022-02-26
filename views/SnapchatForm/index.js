import React, {useState} from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    TextInput
} from 'react-native';
import styles from './styles';

import Feather from 'react-native-vector-icons/Feather';

const WIDTH = Dimensions.get('screen').width;

import { RFPercentage } from 'react-native-responsive-fontsize';

const SnapchatForm = ({ currentSnapchat, updateSnapchat, onContinue}) => {
    const [canContinue, setCanContinue] = useState(false);

    const validInput = newInput => {
        let ok = true;

        if (newInput.length < 3) ok = false;
        if (newInput.indexOf(' ') != -1) ok = false;

        setCanContinue(ok);
    };

    return (
        <View style={{flex: 1}}>
            <View style={[styles.container, {
                width: WIDTH
            }]}>
                <TextInput
                    style={[styles.textInput, {
                        width: WIDTH * 70/100
                    }]}
                    placeholderTextColor='#C0C0C0'
                    placeholder='Snapchat username'
                    value={currentSnapchat}
                    onChangeText={newValue => {
                        validInput(newValue);
                        updateSnapchat(newValue);
                    }}
                    autoCapitalize='none'
                    autoCorrect={false}
                    spellCheck={false}
                />

                <Text style={{
                    textAlign: 'center',
                    color: 'gray',
                    marginTop: 20,
                    paddingHorizontal: 20
                }}>
                    This is NOT your nickname!
                    Be sure the snapchat username above is correct!
                    {'\n'}
                    Otherwise, users will not be able to get in touch with you!
                </Text>
            </View>

            <TouchableOpacity disabled={canContinue? false : true} onPress={onContinue} activeOpacity={0.5} style={[styles.continueBtn, {
                opacity: canContinue? 1 : 0
            }]}>
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

export default SnapchatForm;