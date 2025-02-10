import React, { useCallback, useEffect, useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Input, Text } from '@/components/common';
import { colors, spacing } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import { debounce } from 'lodash-es';
import { useAtom } from 'jotai';
import { searchKeywordAtom } from '@/atoms/search';
import SearchContent from './SearchContent';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const debouncedSetKeyword = debounce((value: string, setter: (value: string) => void) => {
  setter(value);
}, 300);

export function SearchModal({ visible, onClose }: Props) {
  const [searchKeyword, setSearchKeyword] = useAtom(searchKeywordAtom);
  const [inputValue, setInputValue] = useState(searchKeyword);

  const debouncedSearch = useCallback(
    (value: string) => debouncedSetKeyword(value, setSearchKeyword),
    [setSearchKeyword],
  );

  const handleChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    return () => {
      debouncedSetKeyword.cancel();
    };
  }, []);

  const handleClose = () => {
    setSearchKeyword('');
    setInputValue('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color={colors.gray[400]} style={styles.searchIcon} />
            <Input
              value={inputValue}
              onChangeText={handleChange}
              placeholder="책이나 작가를 검색하세요"
              style={styles.input}
            />
          </View>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelButton}>취소</Text>
          </TouchableOpacity>
        </View>
        <SearchContent keyword={searchKeyword.trim()} onClose={handleClose} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 0,
    margin: 0,
    borderWidth: 0,
  },
  cancelButton: {
    color: colors.gray[600],
    fontSize: 16,
  },
});
