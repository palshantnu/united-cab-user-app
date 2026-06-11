import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Pressable,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomDropdownComponent from '../../component/CustomDropdownComponent';
import { Color } from '../../theme';
import Topbar from '../../component/Topbar';
import { useTranslation } from 'react-i18next';


const SignUpScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [gender, setGender] = useState(null);
    const [items, setItems] = useState([
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ]);
    const [checked, setChecked] = useState(false);

    const [items2, setItems2] = useState([
        {
            label: '🇦🇨 Ascension Island',
            value: '🇦🇨 AC',
            emoji: '🇦🇨',
            unicode: 'U+1F1E6 U+1F1E8',
            image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AC.svg',
        },
        {
            label: '🇦🇩 Andorra',
            value: '🇦🇩 AD',
            emoji: '🇦🇩',
            unicode: 'U+1F1E6 U+1F1E9',
            image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AD.svg',
        },
        {
            label: '🇦🇪 United Arab Emirates',
            value: '🇦🇪 UAE',
            emoji: '🇦🇪',
            unicode: 'U+1F1E6 U+1F1EA',
            image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AE.svg',
        },
        {
            label: '🇦🇫 Afghanistan',
            value: '🇦🇫 AF',
            emoji: '🇦🇫',
            unicode: 'U+1F1E6 U+1F1EB',
            image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AF.svg',
        },
        {
            label: '🇦🇬 Antigua & Barbuda',
            value: '🇦🇬 AG',
            emoji: '🇦🇬',
            unicode: 'U+1F1E6 U+1F1EC',
            image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AG.svg',
        },
        {
            label: '🇦🇮 Anguilla',
            value: '🇦🇮 AI',
            emoji: '🇦🇮',
            unicode: 'U+1F1E6 U+1F1EE',
            image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AI.svg',
        },
        {
            label: '🇦🇱 Albania',
            value: '🇦🇱 AL',
            emoji: '🇦🇱',
            unicode: 'U+1F1E6 U+1F1F1',
            image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AL.svg',
        },
        {
            label: '🇦🇲 Armenia',
            value: '🇦🇲 AM',
            emoji: '🇦🇲',
            unicode: 'U+1F1E6 U+1F1F2',
            image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AM.svg',
        },
        {
            label: '🇦🇴 Angola',
            value: '🇦🇴 AO',
            emoji: '🇦🇴',
            unicode: 'U+1F1E6 U+1F1F4',
            image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AO.svg',
        },
        {
            label: '🇦🇶 Antarctica',
            value: '🇦🇶 AQ',
            emoji: '🇦🇶',
            unicode: 'U+1F1E6 U+1F1F6',
            image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AQ.svg',
        },
        {
            label: '🇦🇷 Argentina',
            value: '🇦🇷 AR',
            emoji: '🇦🇷',
            unicode: 'U+1F1E6 U+1F1F7',
            image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AR.svg',
        },
        {
            label: '🇦🇸 American Samoa',
            value: '🇦🇸 AS',
            emoji: '🇦🇸',
            unicode: 'U+1F1E6 U+1F1F8',
            image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AS.svg',
        },
        {
            label: '🇦🇹 Austria',
            value: '🇦🇹 AT',
            emoji: '🇦🇹',
            unicode: 'U+1F1E6 U+1F1F9',
            image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AT.svg',
        },
    ]);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const handleCountrySelect = (item) => {
        console.log("Selected country:", item);
        setSelectedCountry(item);
    };
    const { width } = Dimensions.get('window');
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
        <View style={styles.container}>
            {/* Topbar */}
            <Topbar title={t('SignUp')} navigation={navigation} />

            {/* Form */}
            <View style={styles.form}>
                <TextInput style={styles.input} placeholder={t('Name')} placeholderTextColor="#999" />
                <TextInput style={styles.input} placeholder={t('Email')} placeholderTextColor="#999" />
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>

                    <View style={{ width: width * 0.18, }}>
                        <CustomDropdownComponent
                            Title={t('SelectCountry')}
                            editable={true}
                            placeholder={t('ChooseCountry')}
                            countryData={items2}
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
                        />
                    </View>
                </View>
                {/* <View style={styles.dropdown}> */}
                <View style={styles.dropdown}>
                    <DropDownPicker
                        open={open}
                        value={gender}
                        items={items}
                        setOpen={setOpen}
                        setValue={setGender}
                        setItems={setItems}
                        placeholder={t('SelectGender')}
                        style={{
                            borderColor: '#ccc',
                            marginBottom: 12,
                        }}
                        dropDownContainerStyle={{
                            borderColor: '#ccc',
                        }}

                    />
                </View>

                {/* </View> */}
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

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OtpScreen')}>
                    <Text style={styles.buttonText}>{t('SignUp')}</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>{t('or')}</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.socialIcons}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/facebook-new.png' }} style={styles.icon} />
                    </TouchableOpacity>

                </View>

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
    flag: {
        width: 24,
        height: 16,
        marginRight: 8,
    },
    countryCode: {
        marginRight: 6,
        fontWeight: '500',
    },
    dropdown: {
        width: '100%',
        marginBottom: 12,
        zIndex: 10, // make sure dropdown doesn't overlap others incorrectly
    },

    picker: {
        color: '#000', // makes sure text is visible
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

    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    orText: {
        marginHorizontal: 8,
        color: '#999',
    },

    socialIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    socialButton: {
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    icon: {
        width: 24,
        height: 24,
    },

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
