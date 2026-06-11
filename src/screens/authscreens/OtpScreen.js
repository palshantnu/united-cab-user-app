import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    ScrollView,
    Dimensions
} from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { Color } from '../../theme';
import Topbar from '../../component/Topbar';
import { useTranslation } from 'react-i18next';
import i18n from '../../locales/i18n';
import { postData } from '../../API';
import { CustomToast } from '../../component/ToastConfig';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';


const { width } = Dimensions.get('window');

const OtpScreen = ({ navigation, route }) => {
    const { otp1, phone, country_code, fcmToken } = route.params
    const [loading, setLoading] = useState(false);
    // alert(otp1)
    const { t } = useTranslation();
    const otpInput = useRef(null);
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch();
    useEffect(() => {
        Alert.alert(otp1);
    }, [otp1])
    const handleVerify = async () => {


        if (otp.length < 6) {
            alert(i18n.t('enterOtp'));
            return;
        }
        setLoading(true);
        const body = {
            phone,
            country_code,
            otp_code: otp,
            devicetoken: fcmToken
        };
        console.log('fl');
        console.log('body == > ', body);

        const res = await postData('user/verify-otp', body);
        console.log('res==>', res);
        setLoading(false);
        if (res.message == 'Login successful') {
            CustomToast.show(res.message)
            dispatch({
                type: 'SET_USER',
                payload: res.user,
            });

            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [{ name: 'HomeStack' }],
                }),
            );
            // navigation.navigate('BottomTabNavigator')
        } else {
            // ToastAndroid.show(res.message, ToastAndroid.BOTTOM);
            CustomToast.show(res.message)
        }

        // navigation.navigate('OtpScreen');

    };

    const handleResend = () => {
        Alert.alert('Resent', 'OTP has been resent');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={Color.apptheme} />
                </View>
            )}

            <View style={[styles.container, { backgroundColor: Color.white }]}>
                <View style={{ padding: 20 }}>
                    <Topbar title={t('PhoneVerification')} navigation={navigation} />
                </View>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.innerContainer}
                >



                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={{ flex: 1, padding: 0, backgroundColor: '#fff' }}>
                            <Text style={[styles.subtitle, { color: Color.black }]}>
                                {t('EnterOTPMessage')}
                            </Text>

                            <OTPTextInput
                                ref={otpInput}
                                inputCount={6}
                                tintColor={Color.black}
                                offTintColor={Color.black}
                                handleTextChange={setOtp}
                                containerStyle={styles.otpContainer}
                                textInputStyle={[styles.otpInput, { borderColor: Color.black, borderRadius: 10 }]}
                            />
                            <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 0 }}>
                                <TouchableOpacity style={[styles.button, { backgroundColor: Color.apptheme }]} onPress={handleVerify}>
                                    <Text style={styles.buttonText}>{t('VerifyOTP')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* <TouchableOpacity
                    style={[styles.button, { backgroundColor: Color.apptheme, marginBottom: 20 }]}
                    onPress={handleVerify}
                >
                    <Text style={styles.buttonText}>{t('VerifyOTP')}</Text>
                </TouchableOpacity> */}
                    </ScrollView>

                    {/* Button moves UP with keyboard */}

                </KeyboardAvoidingView>

            </View>
        </SafeAreaView>
    );


};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 20,
        justifyContent: 'space-between',
    },
    innerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "flex-start",
        // paddingHorizontal: 24,
        marginTop: 40,
        width: width - 0
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Figtree-Medium',
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 30,
        textAlign: 'center',
        fontFamily: 'Figtree-Regular',
    },
    otpContainer: {
        width: '100%',
        marginBottom: 20,
        alignSelf: 'center',
    },
    otpInput: {
        borderWidth: 1,
        fontSize: 20,
        fontFamily: 'Figtree-Medium',
        color: '#141B34',
    },
    resendContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    didntReceiveText: {
        fontSize: 14,
        fontFamily: 'Figtree-Regular',
    },
    resendLink: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Figtree-Medium',
    },
    button: {
        width: '90%',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 50,
        alignSelf: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Figtree-SemiBold',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },

});

export default OtpScreen;
