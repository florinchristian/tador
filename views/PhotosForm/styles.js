import {
    StyleSheet
} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1
    },
    floatingContinueButton: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'flex-end',
        backgroundColor: '#feae96',
        paddingVertical: 10,
        borderRadius: 30,
        shadowColor: 'gray',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5
    }
});