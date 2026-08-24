import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Trash2 } from 'lucide-react-native';
import { Colors, Shadows, Typography } from '@/constants/theme';
import { useHouseData } from '@/hooks/useHouseData';
import { Header } from '@/components/Header';
import { RoomCarousel } from '@/components/RoomCarousel';
import { BudgetCard } from '@/components/BudgetCard';
import { FurnitureItemRow } from '@/components/FurnitureItemRow';
import { AddItemCard } from '@/components/AddItemCard';
import { NewRoomModal } from '@/components/Modals/NewRoomModal';
import { EditBudgetModal } from '@/components/Modals/EditBudgetModal';
import { EditItemModal } from '@/components/Modals/EditItemModal';
import { FurnitureItem } from '@/types/house';
import { formatCurrency } from '@/utils/format';

export default function HomeScreen() {
  const {
    loading,
    data,
    selectedRoomId,
    setSelectedRoomId,
    selectedRoom,
    roomItems,
    roomStats,
    stats,
    toggleItemPurchased,
    addItem,
    updateItem,
    deleteItem,
    addRoom,
    deleteRoom,
    updateBudget,
    getStatsForRoom,
  } = useHouseData();

  const scrollViewRef = useRef<ScrollView>(null);
  const [inlineFormFocused, setInlineFormFocused] = useState(false);
  const [keyboardPadding, setKeyboardPadding] = useState(0);

  // Modals state
  const [newRoomModalVisible, setNewRoomModalVisible] = useState(false);
  const [editBudgetModalVisible, setEditBudgetModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<FurnitureItem | null>(null);

  const isModalOpen = newRoomModalVisible || editBudgetModalVisible || !!editingItem;
  const isAllRoomsView = selectedRoomId === 'all';

  // Listen to keyboard show/hide events to dynamically expand and scroll the view
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      // If a modal is open, DO NOT touch the background scrollview
      if (newRoomModalVisible || editBudgetModalVisible || editingItem !== null) {
        return;
      }
      if (inlineFormFocused) {
        const height = e?.endCoordinates?.height || 280;
        setKeyboardPadding(height);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 80);
      }
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardPadding(0);
      setInlineFormFocused(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [inlineFormFocused, newRoomModalVisible, editBudgetModalVisible, editingItem]);

  const handleFocusInlineForm = () => {
    setInlineFormFocused(true);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
  };

  const confirmDeleteRoom = (roomId: string, roomName: string) => {
    if (roomId === 'all') return;
    const itemsInRoom = data.items.filter((i) => i.roomId === roomId);
    const count = itemsInRoom.length;

    const message =
      count > 0
        ? `Tem certeza que deseja excluir o ambiente "${roomName}"?\n\nTodos os ${count} ${
            count === 1 ? 'móvel' : 'móveis'
          } cadastrados nele serão apagados permanentemente.`
        : `Deseja excluir o ambiente "${roomName}"?`;

    Alert.alert('Excluir ambiente', message, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => deleteRoom(roomId),
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.navy} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              !isModalOpen && keyboardPadding > 0 ? keyboardPadding + 30 : 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Header with Title & Top Summary */}
        <Header stats={stats} />

        {/* Ambientes Horizontal Carousel - only visible when rooms exist */}
        {data.rooms.length > 0 && (
          <RoomCarousel
            rooms={data.rooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={setSelectedRoomId}
            onAddNewRoom={() => setNewRoomModalVisible(true)}
            onDeleteRoom={confirmDeleteRoom}
            getStatsForRoom={getStatsForRoom}
          />
        )}

        {/* Total Budget Card */}
        <BudgetCard
          totalBudget={data.totalBudget}
          plannedTotal={stats.plannedTotal}
          onEditBudget={() => setEditBudgetModalVisible(true)}
        />

        {/* Active Room Section */}
        {selectedRoom ? (
          <View style={styles.roomSection}>
            <View style={styles.roomHeader}>
              <View style={styles.roomHeaderInfo}>
                <View style={styles.roomTitleRow}>
                  <Text style={styles.roomTitle}>{selectedRoom.name}</Text>
                  {!isAllRoomsView && (
                    <TouchableOpacity
                      onPress={() => confirmDeleteRoom(selectedRoom.id, selectedRoom.name)}
                      style={styles.deleteRoomButton}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel="Excluir ambiente"
                    >
                      <Trash2 size={16} color="#E06D53" opacity={0.7} />
                    </TouchableOpacity>
                  )}
                </View>
                {selectedRoom.description ? (
                  <Text style={styles.roomDescription}>{selectedRoom.description}</Text>
                ) : null}
              </View>
              <Text style={styles.roomSubtotal}>{formatCurrency(roomStats.total)}</Text>
            </View>

            {/* List of items */}
            {roomItems.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {isAllRoomsView
                    ? 'Nenhum móvel cadastrado na casa ainda.'
                    : `Nenhum móvel cadastrado em ${selectedRoom.name} ainda.`}
                </Text>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {roomItems.map((item) => {
                  const itemRoom = data.rooms.find((r) => r.id === item.roomId);
                  return (
                    <FurnitureItemRow
                      key={item.id}
                      item={item}
                      roomName={isAllRoomsView && itemRoom ? itemRoom.name : undefined}
                      onTogglePurchased={toggleItemPurchased}
                      onEditItem={(itemToEdit) => setEditingItem(itemToEdit)}
                      onDeleteItem={deleteItem}
                    />
                  );
                })}
              </View>
            )}

            {/* Add item inline card */}
            {data.rooms.length > 0 && (
              <AddItemCard
                roomId={selectedRoom.id}
                roomName={selectedRoom.name}
                rooms={data.rooms}
                onAddItem={addItem}
                onFocus={handleFocusInlineForm}
              />
            )}
          </View>
        ) : (
          <View style={styles.noRoomsContainer}>
            <Text style={styles.noRoomsTitle}>Nenhum ambiente criado</Text>
            <Text style={styles.noRoomsSubtitle}>
              Comece criando o primeiro cômodo da futura casa para organizar os móveis!
            </Text>
            <TouchableOpacity
              style={styles.createFirstRoomBtn}
              onPress={() => setNewRoomModalVisible(true)}
              activeOpacity={0.85}
            >
              <Plus size={18} color={Colors.paper} />
              <Text style={styles.createFirstRoomText}>Criar Primeiro Ambiente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer note matching Figma */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {stats.totalItemsCount} {stats.totalItemsCount === 1 ? 'item' : 'itens'} · feito com
            carinho para nós dois ♥
          </Text>
        </View>
      </ScrollView>

      {/* Modals */}
      <NewRoomModal
        visible={newRoomModalVisible}
        onClose={() => setNewRoomModalVisible(false)}
        onAddRoom={addRoom}
      />

      <EditBudgetModal
        visible={editBudgetModalVisible}
        currentBudget={data.totalBudget}
        onClose={() => setEditBudgetModalVisible(false)}
        onSave={updateBudget}
      />

      <EditItemModal
        visible={!!editingItem}
        item={editingItem}
        rooms={data.rooms}
        onClose={() => setEditingItem(null)}
        onSave={updateItem}
        onDelete={deleteItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  roomSection: {
    paddingHorizontal: 20,
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: 16,
    gap: 12,
  },
  roomHeaderInfo: {
    flex: 1,
  },
  roomTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  roomTitle: {
    fontFamily: Typography.fraunces,
    fontSize: 26,
    lineHeight: 30,
    color: Colors.navy,
  },
  deleteRoomButton: {
    padding: 4,
    borderRadius: 6,
  },
  roomDescription: {
    fontFamily: Typography.inter,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.stone,
  },
  roomSubtotal: {
    fontFamily: Typography.mono,
    fontSize: 14,
    color: Colors.stone,
    marginTop: 6,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontFamily: Typography.inter,
    fontSize: 13,
    color: Colors.stone,
    textAlign: 'center',
  },
  itemsList: {
    marginBottom: 8,
  },
  noRoomsContainer: {
    marginHorizontal: 20,
    padding: 28,
    borderRadius: 16,
    backgroundColor: Colors.paperDeep,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  noRoomsTitle: {
    fontFamily: Typography.fraunces,
    fontSize: 20,
    color: Colors.navy,
  },
  noRoomsSubtitle: {
    fontFamily: Typography.inter,
    fontSize: 13,
    color: Colors.stone,
    textAlign: 'center',
    lineHeight: 18,
  },
  createFirstRoomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.navy,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 6,
    ...Shadows.card,
  },
  createFirstRoomText: {
    fontFamily: Typography.interMedium,
    fontSize: 14,
    color: Colors.paper,
  },
  footer: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: Typography.mono,
    fontSize: 11,
    letterSpacing: 1.2,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
