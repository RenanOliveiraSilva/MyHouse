import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Trash2, X } from 'lucide-react-native';
import { Colors, Shadows, Typography } from '@/constants/theme';
import { FurnitureItem, Room } from '@/types/house';

interface EditItemModalProps {
  visible: boolean;
  item: FurnitureItem | null;
  rooms: Room[];
  onClose: () => void;
  onSave: (updatedItem: FurnitureItem) => void;
  onDelete: (itemId: string) => void;
}

export function EditItemModal({
  visible,
  item,
  rooms,
  onClose,
  onSave,
  onDelete,
}: EditItemModalProps) {
  const [name, setName] = useState('');
  const [priceText, setPriceText] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [quantityText, setQuantityText] = useState('1');
  const [selectedRoomId, setSelectedRoomId] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setPriceText(item.price.toString());
      setStoreUrl(item.storeUrl || '');
      setQuantityText((item.quantity || 1).toString());
      setSelectedRoomId(item.roomId);
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;

    const cleanedPrice = priceText
      .replace('R$', '')
      .replace(/\./g, '')
      .replace(',', '.')
      .trim();
    const parsedPrice = parseFloat(cleanedPrice) || 0;
    const parsedQty = parseInt(quantityText, 10) || 1;

    onSave({
      ...item,
      name: name.trim(),
      price: parsedPrice,
      quantity: parsedQty,
      storeUrl: storeUrl.trim() || undefined,
      roomId: selectedRoomId || item.roomId,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(item.id);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <Text style={styles.title}>Editar Móvel</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <X size={20} color={Colors.navy} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {/* Room selector pill list */}
              <Text style={styles.label}>AMBIENTE</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomsScroll}>
                {rooms.map((r) => {
                  const isSelected = r.id === selectedRoomId;
                  return (
                    <TouchableOpacity
                      key={r.id}
                      style={[styles.roomPill, isSelected && styles.roomPillSelected]}
                      onPress={() => setSelectedRoomId(r.id)}
                    >
                      <Text
                        style={[
                          styles.roomPillText,
                          isSelected && styles.roomPillTextSelected,
                        ]}
                      >
                        {r.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Name */}
              <Text style={styles.label}>NOME DO MÓVEL</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Nome do móvel"
                  placeholderTextColor={Colors.textPlaceholder}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Store Link */}
              <Text style={styles.label}>LINK DA LOJA (OPCIONAL)</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.monoInput]}
                  placeholder="https://..."
                  placeholderTextColor={Colors.textPlaceholder}
                  value={storeUrl}
                  onChangeText={setStoreUrl}
                  autoCapitalize="none"
                />
              </View>

              {/* Price & Quantity */}
              <View style={styles.rowInputs}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.label}>PREÇO UNITÁRIO</Text>
                  <View style={[styles.inputWrapper, styles.priceInputWrapper]}>
                    <Text style={styles.currencyPrefix}>R$</Text>
                    <TextInput
                      style={[styles.input, styles.monoInput]}
                      placeholder="0,00"
                      placeholderTextColor={Colors.textPlaceholder}
                      value={priceText}
                      onChangeText={setPriceText}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>QTD</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, styles.monoInput, { textAlign: 'center' }]}
                      placeholder="1"
                      placeholderTextColor={Colors.textPlaceholder}
                      value={quantityText}
                      onChangeText={setQuantityText}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                  <Trash2 size={18} color="#E06D53" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                  <Text style={styles.submitText}>Salvar Alterações</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(36, 55, 87, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '85%',
    backgroundColor: Colors.paper,
    borderRadius: 20,
    padding: 24,
    ...Shadows.cardHover,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontFamily: Typography.fraunces,
    fontSize: 22,
    color: Colors.navy,
  },
  label: {
    fontFamily: Typography.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.stone,
    marginBottom: 6,
    marginTop: 10,
  },
  roomsScroll: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  roomPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.paperDeep,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    marginRight: 8,
  },
  roomPillSelected: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  roomPillText: {
    fontFamily: Typography.inter,
    fontSize: 12,
    color: Colors.navy,
  },
  roomPillTextSelected: {
    color: Colors.paper,
  },
  inputWrapper: {
    backgroundColor: Colors.paperDeep,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
  },
  priceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyPrefix: {
    fontFamily: Typography.mono,
    fontSize: 14,
    color: Colors.stone,
    marginRight: 6,
  },
  input: {
    fontFamily: Typography.inter,
    fontSize: 14,
    color: Colors.navy,
  },
  monoInput: {
    fontFamily: Typography.mono,
    fontSize: 13,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(224, 109, 83, 0.3)',
    backgroundColor: 'rgba(224, 109, 83, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontFamily: Typography.interMedium,
    fontSize: 14,
    color: Colors.paper,
  },
});
