import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TrialExpiredModalProps {
    isVisible: boolean;
    onClose: () => void;
    onGetPremium: () => void;
}

const TrialExpiredModal: React.FC<TrialExpiredModalProps> = ({ isVisible, onClose, onGetPremium }) => {
    return (
        <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Free Trial Expired</Text>

                    <Text style={styles.description}>
                        Your free trial has ended. Get premium to continue accessing exclusive content!
                    </Text>
                    <Text style={styles.featureTitle}>Features</Text>
                    <Text style={styles.features}>
                        ✔ Premium Membership{"\n"}
                        ✔ Access to auction documents{"\n"}
                        ✔ Access to auction notice{"\n"}
                        ✔ Daily email alert{"\n"}
                        ✔ Get Bank persons Contact Details{"\n"}
                        ✔ Get Loan Account Number{"\n"}
                        ✔ Get location on map
                    </Text>

                    <TouchableOpacity style={styles.premiumButton} onPress={onGetPremium}>
                        <Text style={styles.buttonText}>Get Premium</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#222',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        width: '85%',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#ff5555',
        borderRadius: 15,
        padding: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#bbb',
        textAlign: 'center',
        marginBottom: 10,
    },
    featureTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffcc00',
        marginTop: 10,
        marginBottom: 5,
    },
    features: {
        fontSize: 16,
        color: '#ddd',
        textAlign: 'left',
        width: '100%',
        lineHeight: 22,
    },
    premiumButton: {
        backgroundColor: '#ffcc00',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 15,
        shadowColor: '#ffcc00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
});

export default TrialExpiredModal;
