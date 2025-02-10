import React, { useState } from 'react';
import { Animated, Pressable, StyleSheet, TextInput, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing } from '@/styles/theme';
import { useAtom } from 'jotai';
import { bookSearchKeywordAtom } from '@/atoms/book';
import { debounce } from 'lodash-es';

interface Props {
  expanded: boolean;
  onToggle: () => void;
  style?: Animated.AnimatedProps<ViewStyle>;
}

export function SearchBar({ expanded, onToggle, style }: Props) {
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
    onToggle();
  };

  return (
    <Animated.View style={[styles.container, style]}>
      {expanded ? (
        <Animated.View style={styles.inputContainer}>
          <Icon name="search" size={16} color={colors.gray[400]} />
          <TextInput
            style={styles.input}
            placeholder="제목, 저자 검색..."
            placeholderTextColor={colors.gray[400]}
            value={inputValue}
            onChangeText={handleChange}
            autoFocus
          />
          <Pressable onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="x" size={16} color={colors.gray[400]} />
          </Pressable>
        </Animated.View>
      ) : (
        <Pressable onPress={onToggle} style={styles.iconButton}>
          <Icon name="search" size={20} color={colors.gray[600]} />
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 40, // 초기 너비
  },
  inputContainer: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.gray[900],
    padding: 0,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
