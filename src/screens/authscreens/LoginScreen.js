import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import CustomDropdownComponent from '../../component/CustomDropdownComponent';
import { Color } from '../../theme';
import Topbar from '../../component/Topbar';
import { useTranslation } from 'react-i18next';
import { postData } from '../../API';
import AppInputComponent from '../../component/AppInputComponent';
import { countriesData } from '../../constant/Countrydata';
import { CustomToast } from '../../component/ToastConfig';
import { getSyncData, storeDatasync } from '../../storage/AsyncStorage';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
const LoginScreen = ({ navigation }) => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [confirm, setConfirm] = useState(null);

    const handleCountrySelect = (item) => {
        setSelectedCountry(item);
        if (errors.country) {
            setErrors(prev => ({ ...prev, country: '' }));
        }
    };
    const signInWithPhoneNumber = async (phoneNumber) => {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!selectedCountry || Object.keys(selectedCountry).length === 0) {
            newErrors.country = t('PleaseSelectCountry');
        }

        if (!phoneNumber) {
            newErrors.mobile = t('PleaseEnterMobileNumber');
        } else if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
            newErrors.mobile = t('InvalidMobileNumber');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const getFcmToken = async () => {
        try {
            // 1. Request permissions (iOS only)
            await messaging().requestPermission();

            // 2. Register device for remote messages (REQUIRED for iOS)
            await messaging().registerDeviceForRemoteMessages();

            // 3. Try to read old token
            let fcmToken = await getSyncData('fcmToken');
            console.log('Old token:', fcmToken);

            if (!fcmToken) {
                const newToken = await messaging().getToken();
                console.log('New token:', newToken);

                await storeDatasync('fcmToken', newToken);

                SendOtp(newToken);
            } else {
                SendOtp(fcmToken);
            }
        } catch (error) {
            console.log('ERROR GETTING TOKEN:', error);
        }
    };
    useEffect(() => {
        async function setupPush() {
            if (Platform.OS === 'ios') {

                await messaging().requestPermission();

                await messaging().registerDeviceForRemoteMessages();

                console.log('iOS registered for remote messages');
            }
        }
        setupPush();
    }, []);
    const SendOtp = async (fcmToken) => {
        console.log('dne');
        
        if (!validateForm()) return;
        console.log('dne1');
        setLoading(true);
        try {
            const body = {
                phone: phoneNumber,
                country_code: selectedCountry?.country_code || '',
            };
            console.log('dne1',body);
            const res = await postData('user/send-otp', body);
            console.log('OTP Response:', res);
            console.log('dne1',res);
            if (res.message == 'OTP sent successfully') {
                CustomToast.show(res.message)
                navigation.navigate('OtpScreen', {
                    otp1: res.OTP,
                    phone: phoneNumber,
                    country_code: selectedCountry?.country_code || '',
                    fcmToken: fcmToken
                });
            }
            CustomToast.show(res.message)
        } catch (error) {
            console.error('Send OTP error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.container}>
                <Topbar title={t('')} navigation={navigation} />
      
                <View style={styles.form}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.contentContainer}>
                      <Text style={styles.welcomeText}>{t('WelcomeBack')}</Text>
                      <Text style={styles.instructionText}>
                        {t('EnterPhoneNumberForVerification')}
                      </Text>
                      <Text style={styles.instructionDetailText}>
                        {t('YourNumberWillBeUsedForVerificationOnly')}
                      </Text>
                    </View>
      
                    <View style={{ flexDirection: 'row', marginVertical: 30 }}>
                      <View style={{ width: width * 0.18 }}>
                        <CustomDropdownComponent
                          Title={t('SelectCountry')}
                          editable={true}
                          placeholder={t('Choose')}
                          countryData={countriesData}
                          selectedCountryData={selectedCountry}
                          onSelect={handleCountrySelect}
                          errorMessage={errors.country}
                        />
                      </View>
      
                      <View style={{ width: width * 0.01 }} />
      
                      <View style={styles.phoneContainer}>
                        <AppInputComponent
                          value={phoneNumber}
                          onChangeText={(text) => {
                            setPhoneNumber(text);
                            if (errors.mobile) {
                              setErrors(prev => ({ ...prev, mobile: '' }));
                            }
                          }}
                          placeholder={t('EnterPhoneNumber')}
                          keyboardType="phone-pad"
                          maxLength={10}
                        />
                      </View>
                    </View>
      
                    {errors.country && (
                      <Text style={styles.errorText}>{errors.country}</Text>
                    )}
                    {errors.mobile && (
                      <Text style={styles.errorText}>{errors.mobile}</Text>
                    )}
                  </View>
      
                  {/* Button stays visible */}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={getFcmToken}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>{t('Login')}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
      
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    form: {
        flex: 1,
        marginTop: 10,
    },
    contentContainer: {
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Color.apptheme,
        marginBottom: 10,
    },
    instructionText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    instructionDetailText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 30,
    },
    phoneContainer: {
        width: '77%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: Color.apptheme,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 50,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 5,
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

export default LoginScreen;
