import React, { useState } from 'react';
import { View, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import { Button } from '@/components/common/Button';
import { Text } from '@/components/common/Text';
import { useAtom } from 'jotai';
import { authorIdAtom } from '@/atoms/book';
import { useQuery } from '@tanstack/react-query';
import { authorApi } from '@/apis/author';
import Icon from 'react-native-vector-icons/Feather';
import { Input } from '@/components/common/Input';

export function AuthorSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAuthorId, setSelectedAuthorId] = useAtom(authorIdAtom);

  const { data: authors } = useQuery({
    queryKey: ['authors'],
    queryFn: authorApi.getAllAuthors,
    select: response => response.data,
  });

  const selectedAuthor = authors?.find(
    author => author.id.toString() === selectedAuthorId
  );

  const filteredAuthors = authors?.filter(author =>
    author.nameInKor.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (authorId: string) => {
    setSelectedAuthorId(authorId);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedAuthorId(undefined);
  };

  return (
    <>
      <Button
        variant="outline"
        onPress={() => setIsOpen(true)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {selectedAuthor?.nameInKor || '작가'}
        </Text>
        {selectedAuthor ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Icon name="x" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ) : (
          <Icon name="chevron-down" size={16} color="#6B7280" />
        )}
      </Button>

      <Modal visible={isOpen} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>작가 선택</Text>
            <Button variant="text" onPress={() => setIsOpen(false)}>
              닫기
            </Button>
          </View>
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="작가 검색..."
            style={styles.searchInput}
          />
          <FlatList
            data={filteredAuthors}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.authorItem}
                onPress={() => handleSelect(item.id.toString())}
              >
                <Text>{item.nameInKor}</Text>
                {item.id.toString() === selectedAuthorId && (
                  <View style={styles.selectedMark} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    color: '#111827',
    fontSize: 14,
  },
  clearButton: {
    padding: 4,
  },
  modal: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 44,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchInput: {
    margin: 16,
  },
  authorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedMark: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#111827',
  },
}); 