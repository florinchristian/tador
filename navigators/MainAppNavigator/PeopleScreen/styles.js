import {StyleSheet} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleButton: {
        
    },
    title: {
        color: 'white',
        fontSize: RFPercentage(5.5),
        fontWeight: 'bold'
    },
    continueBtn: {
        marginTop: 10,
        backgroundColor: '#05d6d9',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 30
    }
});

export default styles;