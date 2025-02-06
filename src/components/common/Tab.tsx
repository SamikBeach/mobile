import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, spacing } from '../../styles/theme';

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
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
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
