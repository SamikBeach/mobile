import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface TabProps {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Tab({ tabs, value, onChange }: TabProps) {
  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.value}
          style={[styles.tab, value === tab.value && styles.activeTab]}
          onPress={() => onChange(tab.value)}>
          <Text style={[styles.tabText, value === tab.value && styles.activeTabText]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f5',
    padding: 4,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    color: '#71717a',
  },
  activeTabText: {
    color: '#18181b',
    fontWeight: '600',
  },
});
