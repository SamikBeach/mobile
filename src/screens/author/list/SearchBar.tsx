import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing } from '@/styles/theme';
import { useAtom } from 'jotai';
import { authorSearchKeywordAtom } from '@/atoms/author';
import { debounce } from 'lodash-es';
import { LayoutChangeEvent } from 'react-native';
import Animated, { Layout, Easing } from 'react-native-reanimated';

interface Props {
  expanded: boolean;
  onToggle: () => void;
}

export function SearchBar({ expanded, onToggle }: Props) {
  const [searchKeyword, setSearchKeyword] = useAtom(authorSearchKeywordAtom);
  const [inputValue, setInputValue] = useState(searchKeyword);
  const [maxWidth, setMaxWidth] = useState(40);

  useEffect(() => {
    if (!expanded) {
      setInputValue('');
      setSearchKeyword('');
    }
  }, [expanded, setSearchKeyword]);

  const measureParent = (event: LayoutChangeEvent) => {
    const containerWidth = event.nativeEvent.layout.width;
    setMaxWidth(containerWidth - spacing.md * 2);
  };

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
    <View onLayout={measureParent} style={styles.wrapper}>
      <Animated.View
        layout={Layout.duration(200).easing(Easing.bezierFn(0.4, 0, 0.2, 1))}
        style={[
          styles.container,
          {
            width: expanded ? maxWidth : 40,
          },
        ]}>
        {expanded ? (
          <View style={styles.inputContainer}>
            <Icon name="search" size={16} color={colors.gray[400]} />
            <TextInput
              style={styles.input}
              placeholder="작가 검색..."
              placeholderTextColor={colors.gray[400]}
              value={inputValue}
              onChangeText={handleChange}
              autoFocus
            />
            <Pressable onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="x" size={16} color={colors.gray[400]} />
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={onToggle} style={styles.iconButton}>
            <Icon name="search" size={20} color={colors.gray[600]} />
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
  container: {
    height: 40,
    backgroundColor: colors.gray[50],
    borderRadius: 20,
    overflow: 'hidden',
  },
  inputContainer: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
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
