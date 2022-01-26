import React, {useState} from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import styles from './styles';

import Feather from 'react-native-vector-icons/Feather';

import DatePicker from 'react-native-date-picker';

import { RFPercentage } from 'react-native-responsive-fontsize';

const BirthdateForm = ({ currentBirthdate, updateBirthdate, onContinue}) => {
    const [canContinue, setCanContinue] = useState(false);

    const onDateChange = newDate => {
        updateBirthdate(newDate);

        let now = new Date();
        let age = (now.getFullYear() - newDate.getFullYear());

        if (now.getDate() < newDate.getDate()) age--;

        if (age >= 18) setCanContinue(true);
        else setCanContinue(false);
    };

    return (
        <View style={{flex: 1}}>
            <View style={[styles.container, {
                width: Dimensions.get('screen').width
            }]}>
                <DatePicker mode='date' date={currentBirthdate} onDateChange={onDateChange}/>
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

export default BirthdateForm;