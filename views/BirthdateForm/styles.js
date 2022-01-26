import {
    StyleSheet
} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueBtn: {
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginBottom: 25,
        marginRight: 25,
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