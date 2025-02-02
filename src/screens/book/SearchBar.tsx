import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useAtom } from 'jotai';
import { bookSearchKeywordAtom } from '@/atoms/book';
import Icon from 'react-native-vector-icons/Feather';
import { debounce } from 'lodash';

export function SearchBar() {
  const [searchKeyword, setSearchKeyword] = useAtom(bookSearchKeywordAtom);
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
      <Icon name="search" size={16} color="#6B7280" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder="제목, 저자 검색..."
        value={inputValue}
        onChangeText={handleChange}
      />
      {inputValue ? (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Icon name="x" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
}); 