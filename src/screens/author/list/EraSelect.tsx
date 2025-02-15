import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Modal, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text } from '@/components/common/Text';
import { useAtom } from 'jotai';
import { eraIdAtom } from '@/atoms/author';
import { useQuery } from '@tanstack/react-query';
import { eraApi } from '@/apis/era';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { TextInput } from 'react-native';

export function EraSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedEraId, setSelectedEraId] = useAtom(eraIdAtom);

  const { data: eras } = useQuery({
    queryKey: ['eras'],
    queryFn: eraApi.getAllEras,
    select: response => response.data,
  });

  const selectedEra = useMemo(
    () => eras?.find(era => era.id.toString() === selectedEraId),
    [eras, selectedEraId],
  );

  const filteredEras = useMemo(() => {
    if (!search.trim()) return eras;
    return eras?.filter(era => era.eraInKor.toLowerCase().includes(search.trim().toLowerCase()));
  }, [eras, search]);

  const handleSelect = (eraId: string) => {
    setSelectedEraId(eraId);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = () => {
    setSelectedEraId(undefined);
  };

  const handleSearch = (value: string) => {
    setSearch(value.trim());
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={styles.button}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text numberOfLines={1} style={styles.buttonText}>
          {selectedEra?.eraInKor || '시대'}
        </Text>
        {selectedEra ? (
          <TouchableOpacity
            onPress={handleClear}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Icon name="x" size={16} color={colors.gray[400]} />
          </TouchableOpacity>
        ) : (
          <Icon name="chevron-down" size={16} color={colors.gray[400]} />
        )}
      </TouchableOpacity>

      <Modal visible={isOpen} animationType="slide">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>시대 선택</Text>
            <TouchableOpacity
              onPress={() => {
                setIsOpen(false);
                setSearch('');
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.closeButton}>
              <Icon name="x" size={20} color={colors.gray[500]} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Icon name="search" size={16} color={colors.gray[400]} />
            <TextInput
              style={styles.searchInput}
              placeholder="시대 검색..."
              placeholderTextColor={colors.gray[400]}
              value={search}
              onChangeText={handleSearch}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            />
          </View>

          <FlatList
            data={filteredEras}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.eraItem}
                onPress={() => handleSelect(item.id.toString())}>
                <Text style={styles.eraName}>{item.eraInKor}</Text>
                {item.id.toString() === selectedEraId && (
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    minWidth: 94,
    gap: spacing.sm,
    height: 38,
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
    margin: spacing.md,
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
    paddingHorizontal: spacing.lg,
  },
  eraItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  eraName: {
    fontSize: 15,
    color: colors.gray[900],
  },
  closeButton: {
    padding: spacing.xs,
  },
});
