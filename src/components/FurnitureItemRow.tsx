import React from 'react';
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Check, GripVertical, Trash2 } from 'lucide-react-native';
import { Colors, Typography } from '@/constants/theme';
import { FurnitureItem } from '@/types/house';
import { cleanStoreUrl, formatCurrency } from '@/utils/format';

interface FurnitureItemRowProps {
  item: FurnitureItem;
  roomName?: string;
  onTogglePurchased: (id: string) => void;
  onEditItem?: (item: FurnitureItem) => void;
  onDeleteItem: (id: string) => void;
}

export function FurnitureItemRow({
  item,
  roomName,
  onTogglePurchased,
  onEditItem,
  onDeleteItem,
}: FurnitureItemRowProps) {
  const store = cleanStoreUrl(item.storeUrl);

  const handleOpenStore = async () => {
    if (store?.fullUrl) {
      const canOpen = await Linking.canOpenURL(store.fullUrl);
      if (canOpen) {
        Linking.openURL(store.fullUrl);
      }
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Remover item',
      `Deseja remover "${item.name}" da lista?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => onDeleteItem(item.id),
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.rowContainer,
        item.purchased ? styles.rowContainerPurchased : styles.rowContainerDefault,
      ]}
    >
      {/* Drag grip icon */}
      <View style={styles.gripWrapper}>
        <GripVertical size={16} color={Colors.stone} opacity={0.4} />
      </View>

      {/* Checkbox */}
      <TouchableOpacity
        style={[
          styles.checkbox,
          item.purchased ? styles.checkboxChecked : styles.checkboxUnchecked,
        ]}
        onPress={() => onTogglePurchased(item.id)}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {item.purchased && <Check size={12} color={Colors.white} strokeWidth={3} />}
      </TouchableOpacity>

      {/* Main info */}
      <Pressable
        style={styles.mainInfo}
        onPress={() => onEditItem?.(item)}
        onLongPress={confirmDelete}
      >
        <View style={styles.nameRow}>
          <Text
            style={[
              styles.itemName,
              item.purchased ? styles.itemNamePurchased : styles.itemNameDefault,
            ]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          {roomName && (
            <View style={styles.roomBadge}>
              <Text style={styles.roomBadgeText}>{roomName}</Text>
            </View>
          )}
        </View>

        {store && (
          <TouchableOpacity
            onPress={handleOpenStore}
            style={styles.storeLinkContainer}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Text style={styles.storeLinkText}>{store.displayLabel}</Text>
          </TouchableOpacity>
        )}
      </Pressable>

      {/* Price & Action */}
      <View style={styles.rightContainer}>
        <Text
          style={[
            styles.priceText,
            item.purchased ? styles.priceTextPurchased : styles.priceTextDefault,
          ]}
        >
          {formatCurrency(item.price * (item.quantity || 1))}
        </Text>

        <TouchableOpacity
          onPress={confirmDelete}
          style={styles.deleteButton}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Trash2 size={13} color={Colors.stone} opacity={0.35} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 10,
  },
  rowContainerDefault: {
    backgroundColor: Colors.paperDeep,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  rowContainerPurchased: {
    backgroundColor: Colors.tealAlpha05,
    borderWidth: 1,
    borderColor: Colors.tealAlpha20,
  },
  gripWrapper: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxUnchecked: {
    borderWidth: 1.8,
    borderColor: 'rgba(36, 55, 87, 0.3)',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    borderWidth: 1.8,
    borderColor: Colors.teal,
    backgroundColor: Colors.teal,
  },
  mainInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  itemName: {
    fontFamily: Typography.inter,
    fontSize: 15,
    lineHeight: 20,
  },
  itemNameDefault: {
    color: Colors.navy,
  },
  itemNamePurchased: {
    color: Colors.stone,
    textDecorationLine: 'line-through',
  },
  roomBadge: {
    backgroundColor: Colors.borderLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roomBadgeText: {
    fontFamily: Typography.mono,
    fontSize: 10,
    color: Colors.stone,
  },
  storeLinkContainer: {
    marginTop: 2,
  },
  storeLinkText: {
    fontFamily: Typography.mono,
    fontSize: 11,
    color: Colors.teal,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  priceText: {
    fontFamily: Typography.mono,
    fontSize: 13,
  },
  priceTextDefault: {
    color: Colors.navy,
  },
  priceTextPurchased: {
    color: Colors.teal,
  },
  deleteButton: {
    padding: 2,
  },
});
