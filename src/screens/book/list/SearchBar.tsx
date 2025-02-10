import React, { useState, useEffect, useMemo } from 'react';
import { Animated, Pressable, StyleSheet, TextInput, View, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing } from '@/styles/theme';
import { useAtom } from 'jotai';
import { bookSearchKeywordAtom } from '@/atoms/book';
import { debounce } from 'lodash-es';
import { LayoutChangeEvent } from 'react-native';

interface Props {
  expanded: boolean;
  onToggle: () => void;
}

export function SearchBar({ expanded, onToggle }: Props) {
  const [searchKeyword, setSearchKeyword] = useAtom(bookSearchKeywordAtom);
  const [inputValue, setInputValue] = useState(searchKeyword);
  const [maxWidth, setMaxWidth] = useState(40);
  const animatedWidth = useMemo(() => new Animated.Value(40), []);

  // expanded가 false가 되면 검색어 초기화
  useEffect(() => {
    if (!expanded) {
      setInputValue('');
      setSearchKeyword('');
    }
  }, [expanded, setSearchKeyword]);

  // 부모 컨테이너의 너비를 측정하여 최대 확장 너비 설정
  const measureParent = (event: LayoutChangeEvent) => {
    const containerWidth = event.nativeEvent.layout.width;
    setMaxWidth(containerWidth - spacing.md * 2); // 패딩 고려
  };

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: expanded ? maxWidth : 40,
      useNativeDriver: false,
      duration: 250,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    }).start();
  }, [expanded, maxWidth, animatedWidth]);

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
        style={[
          styles.container,
          {
            width: animatedWidth,
          },
        ]}>
        {expanded ? (
          <Animated.View style={[styles.inputContainer]}>
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
