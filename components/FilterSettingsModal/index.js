import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    Animated,
    View,
    Text,
    ScrollView,
    Switch,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { getUniqueId } from 'react-native-device-info';

import { RFPercentage } from 'react-native-responsive-fontsize';
import { HOST, updateFiltersPath } from '../../constants';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const ToggleItem = ({ title, body, description, value, onValueChange }) => {
    return (
        <View style={{
            width: '100%',
            padding: 20
        }}>
            <Text style={{
                textTransform: 'uppercase',
                color: 'gray'
            }}>{title}</Text>

            <View style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderWidth: 2,
                borderColor: '#DCDCDC',
                borderRadius: 30,
                marginVertical: 10
            }}>
                <Text style={{
                    fontSize: RFPercentage(2.5)
                }}>{body}</Text>
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                />
            </View>

            <Text style={{
                color: 'gray'
            }}>{description}</Text>
        </View>
    );
}

const GenderSelector = ({selectedValue, onValueChange}) => {
    return(
        <View style={{
            width: '100%',
            height: 70,
            paddingHorizontal: 20
        }}>
            <Text style={{
                textTransform: 'uppercase',
                color: 'gray',
                marginBottom: 10
            }}>Show me only</Text>
            <View style={{
                flex: 1,
                borderWidth: 2,
                borderColor: '#DCDCDC',
                borderRadius: 50,
                flexDirection: 'row'
            }}>
                <TouchableOpacity activeOpacity={1} onPress={() => onValueChange('male')} style={{
                    width: (WIDTH - 40) / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: selectedValue == 'male'? '#9c55ee' : 'transparent',
                    borderRadius: 50
                }}>
                    <Text style={{
                        fontSize: RFPercentage(2.5),
                        color: selectedValue == 'male'? '#9c55ee' : 'black'
                    }}>Males</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => onValueChange('female')} style={{
                    width: (WIDTH - 40) / 2,
                    height: '100%',
                    position: 'absolute',
                    right: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: selectedValue == 'female'? '#9c55ee' : 'transparent',
                    borderRadius: 50
                }}>
                    <Text style={{
                        fontSize: RFPercentage(2.5),
                        color: selectedValue == 'female'? '#9c55ee' : 'black'
                    }}>Females</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const FilterSettingsModal = ({ visible, genderValue, dateValue, dtfValue, fwbValue, saveFilters, closeModal, toggle}) => {
    const [date, setDate] = useState(dateValue);
    const [dtf, setDtf] = useState(dtfValue);
    const [fwb, setFwb] = useState(fwbValue);

    const [gender, setGender] = useState(genderValue);

    const backgroundIndex = new Animated.Value(0.0);
    const backColor = backgroundIndex.interpolate({
        inputRange: [0.0, 0.5],
        outputRange: ['rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 0.5)']
    });

    const bodyHeight = 60/100 * HEIGHT;

    const yPos = new Animated.Value(-bodyHeight);

    const animDuration = 250;

    const uploadFilters = async () => {
        const result = await axios.put(`http://${HOST}/${updateFiltersPath}`, {
            userId: getUniqueId(),
            newFilters: {
                preferredGender: gender,
                date: date,
                dtf: dtf,
                fwb: fwb
            }
        });
    };

    const fadeIn = () => {
        Animated.parallel([
            Animated.timing(backgroundIndex, {
                toValue: 0.5,
                duration: animDuration,
                useNativeDriver: false
            }),
            Animated.timing(yPos, {
                toValue: 0,
                duration: animDuration,
                useNativeDriver: false
            })
        ]).start();
    };

    const fadeOut = () => {
        Animated.parallel([
            Animated.timing(backgroundIndex, {
                toValue: 0,
                duration: animDuration,
                useNativeDriver: false
            }),
            Animated.timing(yPos, {
                toValue: -bodyHeight,
                duration: animDuration,
                useNativeDriver: false
            })
        ]).start(closeModal);
    };

    useEffect(() => {
        setGender(genderValue);
        setDate(dateValue);
        setDtf(dtfValue);
        setFwb(fwbValue);
    }, [toggle]);

    return (
        <Modal
            transparent
            onShow={fadeIn}
            visible={visible}
        >
            <Animated.View
                style={{
                    flex: 1,
                    backgroundColor: backColor
                }}
            >
                <Animated.View style={{
                    width: '100%',
                    height: bodyHeight,
                    backgroundColor: 'white',
                    position: 'absolute',
                    bottom: yPos,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15
                }}>
                    <View style={{
                        width: '100%',
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity onPress={() => fadeOut()} style={{
                            position: 'absolute',
                            left: 20
                        }}>
                            <Text style={{
                                fontSize: RFPercentage(2.5),
                                color: 'red',
                                fontWeight: 'bold'
                            }}>Dismiss</Text>
                        </TouchableOpacity>

                        <Text style={{
                            fontSize: RFPercentage(3)
                        }}>Filter Settings</Text>

                        {(date != dateValue || dtf != dtfValue || fwb != fwbValue || gender != genderValue) ? (
                            <TouchableOpacity onPress={async() => {
                                await uploadFilters();
                                saveFilters(gender, date, dtf, fwb);
                                fadeOut();
                            }} style={{
                                position: 'absolute',
                                right: 20
                            }}>
                                <Text style={{
                                    fontSize: RFPercentage(2.5),
                                    color: '#29a329',
                                    fontWeight: 'bold'
                                }}>Apply</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{
                        flex: 1
                    }}>
                        <GenderSelector selectedValue={gender} onValueChange={setGender}/>

                        <ToggleItem
                            title={'Date Mode'}
                            body={'Show only users around'}
                            value={date}
                            onValueChange={newValue => setDate(newValue)}
                            description={'While this is enabled Tador will only show you users within 105 kilometers.'}
                        />

                        <ToggleItem
                            title={'DTF Mode'}
                            body={'Show only users around'}
                            value={dtf}
                            onValueChange={newValue => setDtf(newValue)}
                            description={'While this is enabled Tador will only show you users within 105 kilometers.'}
                        />

                        <ToggleItem
                            title={'FWB Mode'}
                            body={'Show only users around'}
                            value={fwb}
                            onValueChange={newValue => setFwb(newValue)}
                            description={'While this is enabled Tador will only show you users within 105 kilometers.'}
                        />
                    </ScrollView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

export default FilterSettingsModal;