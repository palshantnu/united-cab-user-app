import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    Dimensions,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomDropdownComponent from '../../component/CustomDropdownComponent';
import { Color } from '../../theme';
import Topbar from '../../component/Topbar';
import { useTranslation } from 'react-i18next';
import { countriesData } from '../../constant/Countrydata';
import { CustomToast } from '../../component/ToastConfig';
import { getSyncData, storeDatasync } from '../../storage/AsyncStorage';
import messaging from '@react-native-firebase/messaging';
import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';


const SignUpScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);

    const handleCountrySelect = (item) => {
        setSelectedCountry(item);
    };

    const getFcmToken = async () => {
        try {
            await messaging().requestPermission();
            await messaging().registerDeviceForRemoteMessages();

            let fcmToken = await getSyncData('fcmToken');
            if (!fcmToken) {
                fcmToken = await messaging().getToken();
                await storeDatasync('fcmToken', fcmToken);
            }
            SendOtp(fcmToken);
        } catch (error) {
            console.log('ERROR GETTING TOKEN:', error);
            SendOtp(null);
        }
    };

    const SendOtp = async (fcmToken) => {
        if (!name.trim()) {
            alert(t('PleaseEnterName'));
            return;
        }
        if (!selectedCountry) {
            alert(t('PleaseSelectCountry'));
            return;
        }
        if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
            alert(t('InvalidMobileNumber'));
            return;
        }
        // if (!checked) {
        //     alert(t('PleaseAcceptTerms'));
        //     return;
        // }
        setLoading(true);
        const countryCode = selectedCountry?.country_code || '';
        try {
            const confirmation = await signInWithPhoneNumber(getAuth(), `${countryCode}${phoneNumber}`);
            navigation.navigate('OtpScreen', {
                flow: 'register',
                confirmation,
                phone: phoneNumber,
                fcmToken,
                registrationData: {
                    name,
                    phone: phoneNumber,
                    country_code: countryCode,
                },
            });
        } catch (error) {
            console.log('firebase-signInWithPhoneNumber-error==>', error);
            CustomToast.show(error?.message || t('SomethingWentWrong'))
        } finally {
            setLoading(false);
        }
    };

    const { width } = Dimensions.get('window');
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
        <View style={styles.container}>
            {/* Topbar */}
            <Topbar title={t('SignUp')} navigation={navigation} />

            {/* Form */}
            <View style={styles.form}>
                <TextInput value={name} onChangeText={setName} style={styles.input} placeholder={t('Name')} placeholderTextColor="#999" />
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>

                    <View style={{ width: width * 0.18, }}>
                        <CustomDropdownComponent
                            Title={t('SelectCountry')}
                            editable={true}
                            placeholder={t('ChooseCountry')}
                            countryData={countriesData}
                            selectedCountryData={selectedCountry}
                            onSelect={handleCountrySelect}
                            errorMessage="Please select a country"
                        />
                    </View>

                    <View style={{ width: width * 0.01 }} />

                    <View style={styles.phoneContainer}>
                        <TextInput
                            style={styles.phoneInput}
                            placeholder={t('MobileNumber')}
                            placeholderTextColor="#999"
                            keyboardType="phone-pad"
                            maxLength={10}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                    </View>
                </View>
                <View style={styles.termsContainer}>
                    <Ionicons
                        onPress={() => setChecked(!checked)}
                        name="checkmark-circle"
                        size={16}
                        color={checked ? 'green' : 'black'}
                        style={styles.icon}
                    />
                    <Text style={styles.termsText}>
                        {t('TermsText')}{' '}
                        <Text style={styles.link}>{t('TermsOfService')}</Text>{' '}
                        {t('and')}{' '}
                        <Text style={styles.link}>{t('PrivacyPolicy')}</Text>.
                    </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={getFcmToken} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>{t('SignUp')}</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    {t('AlreadyHaveAccount')}{' '}
                    <Text style={styles.footerLink} onPress={() => navigation.navigate('LoginScreen')}>
                        {t('SignIn')}
                    </Text>
                </Text>
            </View>
        </View>
        </SafeAreaView>
    );
};
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    form: {
        flex: 1,
        marginTop: 10,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
        color: '#000',
        width: '100%',
    },
    phoneContainer: {
        // width: width * 0.75,
        width: '77%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
    },
    phoneInput: {
        paddingHorizontal: 10,
        fontSize: 16,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center', // This vertically centers icon and text
        // flexWrap: 'wrap', // in case text overflows
        marginBottom: 30
    },
    icon: {
        marginRight: 6,
    },
    termsText: {
        fontSize: 14,
        flexShrink: 1, // lets text wrap if needed
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },

    button: {
        backgroundColor: Color.apptheme,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontWeight: '600' },

    footerText: {
        textAlign: 'center',
        color: '#333',
    },
    footerLink: {
        color: Color.apptheme,
        fontWeight: '600',
    },
});

export default SignUpScreen;
