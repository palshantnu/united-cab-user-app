import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Color } from '../../theme';
import { useTranslation } from 'react-i18next';

const WalletScreen = () => {
  const { t } = useTranslation();
  const [balance, setBalance] = useState(250.00); // Example balance
  const [transactions, setTransactions] = useState([
    { id: '1', type: 'credit', amount: 100, date: '2025-04-20', note: 'Added to wallet' },
    { id: '2', type: 'debit', amount: 50, date: '2025-04-19', note: 'Ride payment' },
  ]);

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionRow}>
      <Ionicons
        name={item.type === 'credit' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
        size={24}
        color={item.type === 'credit' ? 'green' : 'red'}
        style={{ marginRight: 10 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.note}>{item.note}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={[
        styles.amount,
        { color: item.type === 'credit' ? 'green' : 'red' }
      ]}>
        {item.type === 'credit' ? '+' : '-'} £{item.amount}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
      <View style={styles.container}>
        <Text style={styles.header}>{t('my_wallet')}</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{t('available_balance')}</Text>
          <Text style={styles.balance}>£{balance.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addMoneyButton}>
            <Text style={styles.addMoneyText}>+ {t('add_money')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.historyHeader}>{t('transaction_history')}</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f7fb', padding: 20 },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 5,
  },
  balanceLabel: { fontSize: 16, color: '#666' },
  balance: { fontSize: 28, fontWeight: 'bold', color: Color.apptheme, marginVertical: 10 },
  addMoneyButton: {
    backgroundColor: Color.apptheme,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addMoneyText: { color: '#fff', fontWeight: '600' },
  historyHeader: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  note: { fontSize: 16, fontWeight: '500' },
  date: { fontSize: 12, color: '#888' },
  amount: { fontSize: 16, fontWeight: '600' },
});

export default WalletScreen;
