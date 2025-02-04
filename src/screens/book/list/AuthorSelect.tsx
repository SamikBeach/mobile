import React, { useState } from 'react';
import { View, StyleSheet, Modal, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text } from '@/components/common/Text';
import { useAtom } from 'jotai';
import { authorIdAtom } from '@/atoms/book';
import { useQuery } from '@tanstack/react-query';
import { authorApi } from '@/apis/author';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { TextInput } from 'react-native';

export function AuthorSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAuthorId, setSelectedAuthorId] = useAtom(authorIdAtom);

  const { data: authors } = useQuery({
    queryKey: ['authors'],
    queryFn: authorApi.getAllAuthors,
    select: response =>
      response.data.map(author => ({
        ...author,
        nameInKor: author.nameInKor.trim(),
      })),
  });

  const selectedAuthor = authors?.find(author => author.id.toString() === selectedAuthorId);

  const filteredAuthors = authors?.filter(author =>
    author.nameInKor.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const handleSelect = (authorId: string) => {
    setSelectedAuthorId(authorId);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedAuthorId(undefined);
  };

  const handleSearch = (value: string) => {
    setSearch(value.trim());
  };

  return (
    <>
      <TouchableOpacity onPress={() => setIsOpen(true)} style={styles.button}>
        <Text numberOfLines={1} style={styles.buttonText}>
          {selectedAuthor?.nameInKor || '작가'}
        </Text>
        {selectedAuthor ? (
          <TouchableOpacity
            onPress={handleClear}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="x" size={16} color={colors.gray[400]} />
          </TouchableOpacity>
        ) : (
          <Icon name="chevron-down" size={16} color={colors.gray[400]} />
        )}
      </TouchableOpacity>

      <Modal visible={isOpen} animationType="slide">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>작가 선택</Text>
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="x" size={20} color={colors.gray[500]} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Icon name="search" size={16} color={colors.gray[400]} />
            <TextInput
              style={styles.searchInput}
              placeholder="작가 검색..."
              placeholderTextColor={colors.gray[400]}
              value={search}
              onChangeText={handleSearch}
            />
          </View>

          <FlatList
            data={filteredAuthors}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.authorItem}
                onPress={() => handleSelect(item.id.toString())}>
                <Text style={styles.authorName}>{item.nameInKor}</Text>
                {item.id.toString() === selectedAuthorId && (
                  <Icon name="check" size={16} color={colors.primary[600]} />
                )}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray[50],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    minWidth: 120,
    gap: spacing.sm,
  },
  buttonText: {
    fontSize: 14,
    color: colors.gray[900],
    maxWidth: 120,
  },
  modal: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.gray[900],
    padding: 0,
  },
  list: {
    padding: spacing.lg,
  },
  authorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  authorName: {
    fontSize: 15,
    color: colors.gray[900],
  },
});
