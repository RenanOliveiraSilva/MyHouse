import React, { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Typography } from '@/constants/theme';
import { Room } from '@/types/house';

interface AddItemCardProps {
  roomId: string;
  roomName: string;
  rooms?: Room[];
  onAddItem: (item: {
    roomId: string;
    name: string;
    price: number;
    quantity: number;
    storeUrl?: string;
  }) => void;
  onFocus?: () => void;
}

export function AddItemCard({
  roomId,
  roomName,
  rooms = [],
  onAddItem,
  onFocus,
}: AddItemCardProps) {
  const isAllView = roomId === 'all';
  const [targetRoomId, setTargetRoomId] = useState(
    isAllView ? (rooms[0]?.id || '') : roomId
  );
  const [name, setName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [priceText, setPriceText] = useState('');
  const [quantityText, setQuantityText] = useState('1');

  useEffect(() => {
    if (!isAllView) {
      setTargetRoomId(roomId);
    } else if (rooms.length > 0 && !rooms.some((r) => r.id === targetRoomId)) {
      setTargetRoomId(rooms[0].id);
    }
  }, [roomId, isAllView, rooms, targetRoomId]);

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe o nome do móvel.');
      return;
    }

    const finalRoomId = isAllView ? targetRoomId : roomId;
    if (!finalRoomId) {
      Alert.alert('Atenção', 'Selecione um ambiente para o móvel.');
      return;
    }

    const cleanedPrice = priceText
      .replace('R$', '')
      .replace(/\./g, '')
      .replace(',', '.')
      .trim();

    const parsedPrice = parseFloat(cleanedPrice) || 0;
    const parsedQty = parseInt(quantityText, 10) || 1;

    onAddItem({
      roomId: finalRoomId,
      name: name.trim(),
      price: parsedPrice,
      quantity: parsedQty,
      storeUrl: storeUrl.trim() || undefined,
    });

    setName('');
    setStoreUrl('');
    setPriceText('');
    setQuantityText('1');
    Keyboard.dismiss();
  };

  const selectedTargetRoom = rooms.find((r) => r.id === targetRoomId);

  return (
    <View style={styles.container}>
      <Text style={styles.cardHeaderTitle}>
        + Adicionar móvel{' '}
        {isAllView
          ? selectedTargetRoom
            ? `em ${selectedTargetRoom.name}`
            : ''
          : `em ${roomName}`}
      </Text>

      {/* Room picker when in All Rooms view */}
      {isAllView && rooms.length > 0 && (
        <View style={styles.roomPickerSection}>
          <Text style={styles.pickerLabel}>ESCOLHA O AMBIENTE:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.roomsPickerScroll}
          >
            {rooms.map((r) => {
              const isSelected = r.id === targetRoomId;
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.roomPickerPill,
                    isSelected && styles.roomPickerPillSelected,
                  ]}
                  onPress={() => setTargetRoomId(r.id)}
                >
                  <Text
                    style={[
                      styles.roomPickerPillText,
                      isSelected && styles.roomPickerPillTextSelected,
                    ]}
                  >
                    {r.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Input: Nome do móvel */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="Nome do móvel (ex: Sofá 3 lugares)"
          placeholderTextColor={Colors.textPlaceholder}
          value={name}
          onChangeText={setName}
          onFocus={onFocus}
        />
      </View>

      {/* Input: Link da loja */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.textInput, styles.monoInput]}
          placeholder="Link da loja (opcional)"
          placeholderTextColor={Colors.textPlaceholder}
          value={storeUrl}
          onChangeText={setStoreUrl}
          autoCapitalize="none"
          keyboardType="url"
          onFocus={onFocus}
        />
      </View>

      {/* Inputs row: Preço e Quantidade */}
      <View style={styles.rowInputs}>
        <View style={[styles.inputWrapper, styles.priceInputWrapper]}>
          <Text style={styles.currencyPrefix}>R$</Text>
          <TextInput
            style={[styles.textInput, styles.monoInput, styles.priceInput]}
            placeholder="0,00"
            placeholderTextColor={Colors.textPlaceholder}
            value={priceText}
            onChangeText={setPriceText}
            keyboardType="numeric"
            onFocus={onFocus}
          />
        </View>

        <View style={[styles.inputWrapper, styles.qtyInputWrapper]}>
          <Text style={styles.qtyLabel}>Qtd:</Text>
          <TextInput
            style={[styles.textInput, styles.monoInput, styles.qtyInput]}
            placeholder="1"
            placeholderTextColor={Colors.textPlaceholder}
            value={quantityText}
            onChangeText={setQuantityText}
            keyboardType="number-pad"
            onFocus={onFocus}
          />
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleAdd}
        activeOpacity={0.85}
      >
        <Text style={styles.submitButtonText}>Adicionar à lista</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.paperDeepAlpha50,
    borderWidth: 1.2,
    borderColor: Colors.borderDashed,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
    gap: 10,
  },
  cardHeaderTitle: {
    fontFamily: Typography.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.stone,
    marginBottom: 2,
  },
  roomPickerSection: {
    marginBottom: 4,
  },
  pickerLabel: {
    fontFamily: Typography.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.stone,
    marginBottom: 6,
  },
  roomsPickerScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  roomPickerPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: Colors.paperDeep,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
  },
  roomPickerPillSelected: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  roomPickerPillText: {
    fontFamily: Typography.inter,
    fontSize: 12,
    color: Colors.navy,
  },
  roomPickerPillTextSelected: {
    color: Colors.paper,
  },
  inputWrapper: {
    backgroundColor: Colors.paper,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    justifyContent: 'center',
  },
  textInput: {
    fontFamily: Typography.inter,
    fontSize: 14,
    color: Colors.navy,
    paddingVertical: 0,
  },
  monoInput: {
    fontFamily: Typography.mono,
    fontSize: 13,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  priceInputWrapper: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyPrefix: {
    fontFamily: Typography.mono,
    fontSize: 13,
    color: Colors.textPlaceholder,
    marginRight: 6,
  },
  priceInput: {
    flex: 1,
  },
  qtyInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  qtyLabel: {
    fontFamily: Typography.mono,
    fontSize: 11,
    color: Colors.textPlaceholder,
    marginRight: 4,
  },
  qtyInput: {
    flex: 1,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.navy,
    borderRadius: 8,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitButtonText: {
    fontFamily: Typography.interMedium,
    fontSize: 14,
    color: Colors.paper,
  },
});
