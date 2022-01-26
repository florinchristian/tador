import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Image
} from 'react-native';
import styles from './styles';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import { launchImageLibrary } from 'react-native-image-picker';

const WIDTH = Dimensions.get('screen').width;

import { RFPercentage } from 'react-native-responsive-fontsize';

const useForceUpdate = () => {
    const [value, setValue] = useState(1);
    return () => setValue(value * -1);
};

const UserImage = ({ source, onPress }) => {
    const padding = 20;

    return (
        <View style={{
            width: WIDTH / 2 - padding,
            height: (WIDTH / 2 + 50) - padding,
            marginBottom: padding
        }}>
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
    const padding = 20;

    return (
        <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={{
            width: WIDTH / 2 - padding,
            height: (WIDTH / 2 + 50) - padding,
            marginBottom: padding,
            backgroundColor: '#E8E8E8',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Feather
                name='plus-circle'
                color='#C0C0C0'
                size={RFPercentage(5.3)}
            />
        </TouchableOpacity>
    );
};

const PhotosForm = ({ currentPhotos, updatePhotos, onContinue }) => {
    const [localPhotos, setLocalPhotos] = useState(currentPhotos);
    const forceUpdate = useForceUpdate();

    const addPhoto = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' });

        if (result.didCancel) return;

        let newPhotos = localPhotos;
        newPhotos.push(result.assets[0].uri);

        setLocalPhotos(newPhotos);
        updatePhotos(newPhotos);

        forceUpdate();
    };

    const deleteImage = photoUrl => {
        let newPhotos = localPhotos.filter(item => item != photoUrl);

        updatePhotos(newPhotos);
        setLocalPhotos(newPhotos);

        forceUpdate();
    };


    const renderList = () => {
        let list = localPhotos.map(photoUrl => (
            <UserImage
                key={photoUrl}
                source={photoUrl}
                onPress={() => deleteImage(photoUrl)}
            />
        ));

        if (list.length < 4) {
            list.push(<AddButton onPress={addPhoto} key={'addButton'} />);
        } 
        //list.push(<UserImage source={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZh5eozk_vAo-kP_DUXTSc-8QuEcGhOqBlTrnCIU0R7Uo0i-YVZZn0Y3MRnPpWTN1huPc&usqp=CAU'} key={'textImage'}/>)

        return list;
    };

    useEffect(() => {
        
    }, [localPhotos]);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                paddingTop: 10
            }} style={[styles.container, {
                width: WIDTH
            }]}>
                {renderList()}
            </ScrollView>

            {(localPhotos.length != 0) ? (
                <TouchableOpacity onPress={onContinue} activeOpacity={0.5} style={styles.floatingContinueButton}>
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
            ) : null}
        </View>
    );
};

export default PhotosForm;