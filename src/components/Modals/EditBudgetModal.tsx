import React, { useEffect, useState } from 'react';
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

interface EditBudgetModalProps {
  visible: boolean;
  currentBudget: number;
  onClose: () => void;
  onSave: (newBudget: number) => void;
}

export function EditBudgetModal({
  visible,
  currentBudget,
  onClose,
  onSave,
}: EditBudgetModalProps) {
  const [budgetText, setBudgetText] = useState(currentBudget.toString());

  useEffect(() => {
    if (visible) {
      setBudgetText(currentBudget > 0 ? currentBudget.toString() : '');
    }
  }, [visible, currentBudget]);

  const handleSubmit = () => {
    const cleaned = budgetText
      .replace('R$', '')
      .replace(/\./g, '')
      .replace(',', '.')
      .trim();
    const parsed = parseFloat(cleaned) || 0;
    onSave(parsed);
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
              <Text style={styles.title}>Editar Orçamento Total</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <X size={20} color={Colors.navy} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>VALOR MÁXIMO PLANEJADO (TETO)</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencyPrefix}>R$</Text>
              <TextInput
                style={styles.input}
                placeholder="25000"
                placeholderTextColor={Colors.textPlaceholder}
                value={budgetText}
                onChangeText={setBudgetText}
                keyboardType="numeric"
                autoFocus
              />
            </View>

            <Text style={styles.helperText}>
              Este valor é a referência geral para os cálculos de folga e porcentagem de gastos.
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Salvar Orçamento</Text>
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
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: Colors.paperDeep,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyPrefix: {
    fontFamily: Typography.mono,
    fontSize: 16,
    color: Colors.stone,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: Typography.mono,
    fontSize: 18,
    color: Colors.navy,
  },
  helperText: {
    fontFamily: Typography.inter,
    fontSize: 12,
    color: Colors.stone,
    marginTop: 10,
    lineHeight: 16,
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
