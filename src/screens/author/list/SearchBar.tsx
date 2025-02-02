import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useAtom } from 'jotai';
import Icon from 'react-native-vector-icons/Feather';
import { authorSearchKeywordAtom } from '@/atoms/author';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { debounce } from 'lodash-es';

export function SearchBar() {
  const [searchKeyword, setSearchKeyword] = useAtom(authorSearchKeywordAtom);
  const [inputValue, setInputValue] = useState(searchKeyword);

  const debouncedSearch = debounce((value: string) => {
    setSearchKeyword(value);
  }, 300);

  const handleChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setInputValue('');
    setSearchKeyword('');
  };

  return (
    <View style={styles.container}>
      <Icon name="search" size={16} color={colors.gray[400]} />
      <TextInput
        style={styles.input}
        placeholder="작가 검색..."
        placeholderTextColor={colors.gray[400]}
        value={inputValue}
        onChangeText={handleChange}
      />
      {inputValue ? (
        <TouchableOpacity
          onPress={handleClear}
          style={styles.clearButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="x" size={16} color={colors.gray[400]} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.gray[900],
    padding: 0,
  },
  clearButton: {
    padding: spacing.xs,
  },
}); 