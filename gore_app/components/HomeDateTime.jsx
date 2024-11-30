import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';

function HomeDateTime() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const formatDate = (date) => {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString(undefined, options);
        };

        setCurrentDate(formatDate(new Date()));
        // Update current time every second
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval); // Clean up interval on unmount
    }, []);

    return (
        <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{currentDate}</Text>
            <Text style={styles.timeText}>Time: {currentTime.toLocaleTimeString()}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    dateContainer: {
        padding: 12,
        backgroundColor: '#f39c12',
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    dateText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    timeText: {
        fontSize: 18,
        color: '#fff',
    }
});

export default HomeDateTime