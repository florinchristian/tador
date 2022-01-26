import React, {useRef} from 'react';
import {
    Modal,
    View,
    Animated,
    TouchableOpacity
} from 'react-native';
import PersonView from '../PersonView';

const animDuration = 300;

const PersonViewModal = ({onReportPress, visible, images, closeModal}) => {
    const backgroundIndex = new Animated.Value(0.0);
    const backColor = backgroundIndex.interpolate({
        inputRange: [0.0, 0.7],
        outputRange: ['rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 0.7)']
    });

    const personScale = new Animated.Value(0);

    const fadeIn = () => {
        Animated.parallel([
            Animated.timing(backgroundIndex, {
                toValue: 0.7,
                duration: animDuration,
                useNativeDriver: false
            }),
            Animated.timing(personScale, {
                toValue: 1,
                duration: animDuration,
                useNativeDriver: false
            })
        ]).start();
    };

    const fadeOut = () => {
        Animated.parallel([
            Animated.timing(backgroundIndex, {
                toValue: 0.0,
                duration: animDuration,
                useNativeDriver: false
            }),
            Animated.timing(personScale, {
                toValue: 0,
                duration: animDuration,
                useNativeDriver: false
            })
        ]).start(closeModal);
    };

    return(
        <Modal
            transparent
            onShow={fadeIn}
            animationType='none'
            visible={visible}
        >
            <Animated.View
                style={{
                    flex: 1,
                    backgroundColor: backColor
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} 
                    onPress={() => fadeOut()}
                >
                    <Animated.View style={{
                        transform: [{scale: personScale}]
                    }}>
                        <PersonView 
                            images={images}
                            onReportPress={onReportPress}
                        />
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
        </Modal>
    );
};

export default PersonViewModal;