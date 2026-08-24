import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Colors, Shadows, Typography } from '@/constants/theme';

interface NewRoomModalProps {
  visible: boolean;
  onClose: () => void;
  onAddRoom: (name: string, description: string) => void;
}

export function NewRoomModal({ visible, onClose, onAddRoom }: NewRoomModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAddRoom(name.trim(), description.trim() || 'Espaço da nossa casa');
    setName('');
    setDescription('');
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
              <Text style={styles.title}>Novo Ambiente</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <X size={20} color={Colors.navy} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>NOME DO AMBIENTE</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Ex: Varanda Gourmet, Banheiro, Closet"
                placeholderTextColor={Colors.textPlaceholder}
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </View>

            <Text style={styles.label}>DESCRIÇÃO / DETALHES (OPCIONAL)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Ex: O cantinho do churrasco e das plantas"
                placeholderTextColor={Colors.textPlaceholder}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Criar Ambiente</Text>
              </TouchableOpacity>
            </View>
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
    maxWidth: 420,
    backgroundColor: Colors.paper,
    borderRadius: 20,
    padding: 24,
    ...Shadows.cardHover,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  inputWrapper: {
    backgroundColor: Colors.paperDeep,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    justifyContent: 'center',
  },
  input: {
    fontFamily: Typography.inter,
    fontSize: 14,
    color: Colors.navy,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontFamily: Typography.interMedium,
    fontSize: 14,
    color: Colors.stone,
  },
  submitBtn: {
    flex: 2,
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
