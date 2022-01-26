import React, { useState, useEffect} from 'react';
import {
    View,
    Dimensions,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RFPercentage } from 'react-native-responsive-fontsize';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const PersonView = ({images, onReportPress}) => {
    const [imageIndex, setIndex] = useState(0);

    const seek = sign => {
        let newIndex = imageIndex + sign;

        if (newIndex == images.length) setIndex(0);
        else if (newIndex < 0) setIndex(images.length - 1);
        else setIndex(newIndex);
    };

    const renderTopBars = () => {
        let list = [];

        for (let i = 1; i <= images.length; ++i) {
            list.push(
                <View key={i} style={{
                    flex: 1,
                    height: 3,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    marginHorizontal: 10,
                    opacity: (i == imageIndex + 1) ? 1 : 0.5
                }}></View>
            )
        }

        return list;
    };

    useEffect(() => {
        setIndex(0);
    }, [images]);

    return (
        <View style={{
            backgroundColor: 'white',
            width: WIDTH * 80 / 100,
            height: HEIGHT * 58 / 100,
            borderRadius: 20,
            alignSelf: 'center',
            overflow: 'hidden',
        }}>
            <View style={{
                width: '100%',
                height: '3%',
                paddingHorizontal: 10,
                alignItems: 'center',
                zIndex: 10,
                flexDirection: 'row'
            }}>
                {images.length > 1? renderTopBars() : null}
            </View>

            <TouchableOpacity onPress={onReportPress} activeOpacity={1} style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                zIndex: 90,
                shadowColor: 'gray',
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowOpacity: 1,
                shadowRadius: 10,
                elevation: 5
            }}>
                <MaterialIcons 
                    name='report'
                    color={'white'}
                    size={RFPercentage(5)}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => seek(-1)} style={{
                position: 'absolute',
                width: '40%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: 11
            }}>

            </TouchableOpacity>

            <Image
                source={{ uri: images[imageIndex] }}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute'
                }}
            />

            <TouchableOpacity onPress={() => seek(1)} style={{
                position: 'absolute',
                width: '40%',
                height: '100%',
                top: 0,
                right: 0,
                zIndex: 11
            }}>

            </TouchableOpacity>
        </View>
    );
};

export default PersonView;