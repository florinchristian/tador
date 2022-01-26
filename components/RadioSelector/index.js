import React from 'react';
import {
    View,
    TouchableOpacity,
    Text
} from 'react-native';

import { RFPercentage } from 'react-native-responsive-fontsize';

import Entypo from 'react-native-vector-icons/Entypo';

const RadioSelector = ({ title, selectedValue, possibleValues, onValueChange}) => {
    const renderPossibleValues = () => {
        let list = [];

        for (let innerValue in possibleValues) {
            list.push(
                <TouchableOpacity key={innerValue} onPress={() => onValueChange(innerValue)} activeOpacity={1} style={{
                    borderTopWidth: 0.5,
                    borderTopColor: '#C0C0C0',
                    width: '100%',
                    backgroundColor: 'white',
                    padding: 15,
                    borderBottomLeftRadius: innerValue == 'female'? 12 : 0,
                    borderBottomRightRadius: innerValue == 'female'? 12 : 0,
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                }}>
                    <Text style={{
                        color: 'black',
                        fontSize: RFPercentage(2.7)
                    }}>{possibleValues[innerValue]}</Text>

                    {innerValue == selectedValue? (
                        <Entypo 
                            name='check'
                            color={'#1E90FF'}
                            style={{
                                alignSelf: 'center',
                                marginLeft: 10
                            }}
                            size={RFPercentage(3)}
                        />
                    ) : 
                        <View style={{
                            marginLeft: 10 + RFPercentage(3)
                        }}>

                        </View>
                    }
                </TouchableOpacity>
            );
        }

        return list;
    };

    return (
        <View style={{
            width: '100%'
        }}>
            <TouchableOpacity activeOpacity={1} style={{
                width: '100%',
                backgroundColor: 'white',
                marginTop: 20,
                padding: 15,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Text style={{
                    color: 'black',
                    fontSize: RFPercentage(2.7)
                }}>{title}</Text>

                <Text style={{
                    color: 'gray',
                    fontSize: RFPercentage(2.7),
                    marginRight: 10
                }}>{possibleValues[selectedValue]}</Text>
            </TouchableOpacity>

            {renderPossibleValues()}
        </View>
    );
};

export default RadioSelector;