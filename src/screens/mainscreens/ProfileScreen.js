import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Platform,
    ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Color } from '../../theme';
import { postData, postDataAndImage } from '../../API';
import { useDispatch, useSelector } from 'react-redux';
import { CustomToast } from '../../component/ToastConfig';
import ImagePicker from 'react-native-image-crop-picker';

const ProfileScreen = ({ navigation }) => {
    const [editMode, setEditMode] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const userdetails = useSelector(state => state.userdetails);
    const [profile, setProfile] = useState(userdetails);
    const [imageUri, setImageUri] = useState(profile.profile_image);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        GetProfile();
    }, []);

    const GetProfile = async () => {
        const body = { user_id: user.id };
        const res = await postData('user_profile', body);
        console.log('profile', res);

        dispatch({ type: 'SET_USERDETAILS', payload: res.user });
        setProfile(res.user);
    };

    const handleChange = (field, value) => {
        setProfile({ ...profile, [field]: value });
    };

    const updateProfile = async () => {
        setIsLoading(true); // Start loading

        const formData = new FormData();
        formData.append('user_id', user.id);
        formData.append('name', profile.name);
        formData.append('phone', profile.phone);
        formData.append('email', profile.email);

        if (imageUri && !imageUri.startsWith('http')) {
            const filename = imageUri.split('/').pop();
            const ext = filename.split('.').pop();
            const mimeType = `image/${ext}`;

            formData.append('profile', {
                uri: imageUri,
                type: mimeType,
                name: filename
            });
        }
        console.log(formData);



        try {
            const res = await postDataAndImage('user_profile_update', formData, true); // assume third param sets multi
            console.log('res', res);
            if (res.message == 'User profile updated successfully') {
                CustomToast.show('Your Profile Updated Successfully');
                dispatch({ type: 'SET_USERDETAILS', payload: res.profile || profile });
                setEditMode(false);
            }
        } catch (error) {
            console.error('Update failed:', error);
        }
        finally {
            setIsLoading(false); // End loading
        }

    };

    const pickImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            mediaType: 'photo'
        }).then(image => {
            console.log('Selected Image:', image);
            setImageUri(image.path);
        }).catch(e => {
            console.log('Image picking cancelled or failed:', e);
        });
    };
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>👤 User Profile</Text>
                <TouchableOpacity onPress={() => setEditMode(!editMode)}>
                    <Ionicons
                        name={editMode ? 'checkmark-done-outline' : 'create-outline'}
                        size={24}
                        color="#000"
                    />
                </TouchableOpacity>
            </View>

            {/* {console.log('profile',profile)
} */}
            <ScrollView contentContainerStyle={styles.profileContainer}>
                <TouchableOpacity onPress={editMode ? pickImage : null}>
                    <Image
                        source={
                            imageUri
                                ? { uri: imageUri }
                                : profile.profile
                                    ? { uri: `https://unitedcabsmerthyr.uk/${profile.profile}` }
                                    : { uri: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png' }
                        }
                        style={styles.profileImage}
                    />

                </TouchableOpacity>

                <View style={styles.card}>
                    {/* Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        {editMode ? (
                            <TextInput
                                style={styles.input}
                                value={profile?.name}
                                onChangeText={(text) => handleChange('name', text)}
                            />
                        ) : (
                            <Text style={styles.value}>{profile?.name}</Text>
                        )}
                    </View>

                    {/* Phone */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        {editMode ? (
                            <TextInput
                                style={styles.input}
                                value={profile?.phone}
                                onChangeText={(text) => handleChange('phone', text)}
                                keyboardType="phone-pad"
                            />
                        ) : (
                            <Text style={styles.value}>{profile?.phone}</Text>
                        )}
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        {editMode ? (
                            <TextInput
                                style={styles.input}
                                value={profile?.email}
                                onChangeText={(text) => handleChange('email', text)}
                                keyboardType="email-address"
                            />
                        ) : (
                            <Text style={styles.value}>{profile?.email}</Text>
                        )}
                    </View>

                    {/* Save Button */}
                    {editMode && (
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={updateProfile}
                            disabled={isLoading}
                        >
                            <Text style={styles.saveButtonText}>
                                {isLoading ? 'Updating...' : '💾 Save Profile'}
                            </Text>
                        </TouchableOpacity>

                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: Color.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 20 : 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerText: {
        color: '#000',
        fontSize: 22,
        fontWeight: '700',
    },
    profileContainer: {
        padding: 20,
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: Color.apptheme,
    },
    imageInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        fontSize: 14,
        color: '#333',
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '100%',
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#777',
        marginBottom: 4,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fdfdfd',
    },
    value: {
        fontSize: 16,
        color: '#333',
        paddingVertical: 6,
        fontWeight: '500',
    },
    saveButton: {
        marginTop: 20,
        backgroundColor: Color.apptheme,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
