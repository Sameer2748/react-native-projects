import { View, Text, ActivityIndicator, Image, Touchable, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native'
import React, { useEffect } from 'react'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'

import { Link, router } from 'expo-router';
import { SignOutButton } from '../../components/SignOut';
import { useTransactions } from '../../hooks/useTransactions';
import { COLORS } from '../../constants/colors';
import { styles } from '../../assets/styles/home.styles';
import {Ionicons } from '@expo/vector-icons';
import BalanceCard from '../../components/BalanceCard';
import TransactionItem from '../../components/TransactionItem';
import NoTransactionsFound from '../../components/NoTransactionFound';


const Page = () => {
    const user = useUser();
    // console.log(JSON.stringify(user.user));
    const { transactions, summary, loading, error, loadData, deleteTransaction } = useTransactions(user?.user?.id);


    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async()=>{
        setRefreshing(true);
        try {
            await loadData();
        } catch (error) {
            console.error('Error refreshing transactions:', error);
        } finally {
            setRefreshing(false);
        }
    }
    
    useEffect(() => {
     loadData()
    }, [loadData])
    
    
    if (loading && !refreshing) {
        return <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary}  />
        </View>
    }




    const handleDelete = async (id) => {
        try {
            Alert.alert(
                "Delete Transaction",
                "Are you sure you want to delete this transaction?",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress:async () =>{ 
                            await deleteTransaction(id)
                            loadData();
                        }
                    }
                ]
            );

        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    }
  return (
    <View style={styles.container}>
        <View style={styles.content}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Image source={require('../../assets/images/logo.png')} resizeMode='contain' style={styles.headerLogo} />
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeText}>Welcome,</Text>
                        <Text style={styles.usernameText}>{user?.user?.emailAddresses[0]?.emailAddress.split('@')[0]}</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.addButton} onPress={() => {router.push('/create')}}>
                         <Ionicons name="add" size={20} color={COLORS.white} />
                         <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                    <SignOutButton />
                </View>

            </View>

            <BalanceCard summary={summary} />

            <View style={styles.transactionsContainer}>
                <Text style={styles.transactionTitle}>View Transactions</Text>
            </View>
        </View>

        <FlatList
            style={styles.transactionsList}
            contentContainerStyle={styles.transactionsListContent}
            data={transactions?.transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
               <TransactionItem item={item} onDelete={handleDelete} />
            )}
            ListEmptyComponent={<NoTransactionsFound/>}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
        
        
    </View>
  )
}

export default Page