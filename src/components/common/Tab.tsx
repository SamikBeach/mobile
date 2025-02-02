import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabProps {
  tabs: Array<{ key: string; title: string }>;
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export const Tab = ({ tabs, activeTab, onChangeTab }: TabProps) => {
  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => onChangeTab(tab.key)}>
          <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: '600',
  },
});
