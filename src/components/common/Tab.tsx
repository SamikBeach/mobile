import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, spacing } from '../../styles/theme';

interface TabProps {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Tab({ tabs, value, onChange, containerStyle }: TabProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.tabsContainer}>
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
    borderBottomWidth: 2,
    borderBottomColor: colors.gray[900],
  },
  tabText: {
    fontSize: 14,
    color: colors.gray[500],
  },
  activeTabText: {
    color: colors.gray[900],
    fontWeight: '600',
  },
});
