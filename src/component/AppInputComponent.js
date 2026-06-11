// components/AppInputComponent.js

import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const AppInputComponent = ({
    value,
    onChangeText,
    placeholder = '',
    keyboardType = 'default',
    secureTextEntry = false,
    maxLength,
    style,
    placeholderTextColor = '#999',
    editable = true,
    ...rest
}) => {
    return (
        <TextInput
            style={[styles.input, style]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            maxLength={maxLength}
            editable={editable}
            {...rest}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        paddingHorizontal: 12,
        fontSize: 16,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
});

export default AppInputComponent;
