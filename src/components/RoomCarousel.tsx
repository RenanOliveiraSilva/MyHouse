import React, { useRef } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Shadows, Typography } from '@/constants/theme';
import { Room } from '@/types/house';
import { formatCurrency } from '@/utils/format';

interface RoomCarouselProps {
  rooms: Room[];
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
  onAddNewRoom: () => void;
  onDeleteRoom?: (roomId: string, roomName: string) => void;
  getStatsForRoom: (roomId: string) => {
    total: number;
    count: number;
    bought: number;
    percentage: number;
  };
}

export function RoomCarousel({
  rooms,
  selectedRoomId,
  onSelectRoom,
  onAddNewRoom,
  onDeleteRoom,
  getStatsForRoom,
}: RoomCarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollLeft = () => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const scrollRight = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const allStats = getStatsForRoom('all');
  const isAllSelected = selectedRoomId === 'all';

  return (
    <View style={styles.section}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>AMBIENTES</Text>
        {rooms.length > 1 && (
          <View style={styles.arrowsRow}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={scrollLeft}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={scrollRight}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Horizontal Scroll Cards */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {/* Card "Todos os Móveis" (Visão Geral) */}
        <Pressable
          style={[
            styles.roomCard,
            isAllSelected ? styles.roomCardSelected : styles.roomCardDefault,
          ]}
          onPress={() => onSelectRoom('all')}
        >
          <View style={styles.cardTopRow}>
            <Text
              style={[
                styles.roomName,
                isAllSelected ? styles.roomNameSelected : styles.roomNameDefault,
              ]}
              numberOfLines={1}
            >
              Todos os Móveis
            </Text>
            <Text
              style={[
                styles.itemCount,
                isAllSelected ? styles.itemCountSelected : styles.itemCountDefault,
              ]}
            >
              {allStats.count} {allStats.count === 1 ? 'item' : 'itens'}
            </Text>
          </View>

          <Text
            style={[
              styles.roomTotal,
              isAllSelected ? styles.roomTotalSelected : styles.roomTotalDefault,
            ]}
          >
            {formatCurrency(allStats.total)}
          </Text>

          <View
            style={[
              styles.progressTrack,
              isAllSelected ? styles.progressTrackSelected : styles.progressTrackDefault,
            ]}
          >
            <View
              style={[
                styles.progressFill,
                isAllSelected ? styles.progressFillSelected : styles.progressFillDefault,
                { width: `${Math.min(Math.max(allStats.percentage, 0), 100)}%` },
              ]}
            />
          </View>

          <Text
            style={[
              styles.boughtLabel,
              isAllSelected ? styles.boughtLabelSelected : styles.boughtLabelDefault,
            ]}
          >
            {allStats.bought}/{allStats.count} comprados
          </Text>
        </Pressable>

        {/* Room Specific Cards */}
        {rooms.map((room) => {
          const isSelected = room.id === selectedRoomId;
          const { total, count, bought, percentage } = getStatsForRoom(room.id);

          return (
            <Pressable
              key={room.id}
              style={[
                styles.roomCard,
                isSelected ? styles.roomCardSelected : styles.roomCardDefault,
              ]}
              onPress={() => onSelectRoom(room.id)}
              onLongPress={() => onDeleteRoom?.(room.id, room.name)}
            >
              {/* Header row in card */}
              <View style={styles.cardTopRow}>
                <Text
                  style={[
                    styles.roomName,
                    isSelected ? styles.roomNameSelected : styles.roomNameDefault,
                  ]}
                  numberOfLines={1}
                >
                  {room.name}
                </Text>
                <Text
                  style={[
                    styles.itemCount,
                    isSelected ? styles.itemCountSelected : styles.itemCountDefault,
                  ]}
                >
                  {count} {count === 1 ? 'item' : 'itens'}
                </Text>
              </View>

              {/* Total price */}
              <Text
                style={[
                  styles.roomTotal,
                  isSelected ? styles.roomTotalSelected : styles.roomTotalDefault,
                ]}
              >
                {formatCurrency(total)}
              </Text>

              {/* Progress bar */}
              <View
                style={[
                  styles.progressTrack,
                  isSelected ? styles.progressTrackSelected : styles.progressTrackDefault,
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    isSelected ? styles.progressFillSelected : styles.progressFillDefault,
                    { width: `${Math.min(Math.max(percentage, 0), 100)}%` },
                  ]}
                />
              </View>

              {/* Bought label */}
              <Text
                style={[
                  styles.boughtLabel,
                  isSelected ? styles.boughtLabelSelected : styles.boughtLabelDefault,
                ]}
              >
                {bought}/{count} comprados
              </Text>
            </Pressable>
          );
        })}

        {/* Add new room card */}
        <TouchableOpacity
          style={styles.addRoomCard}
          onPress={onAddNewRoom}
          activeOpacity={0.8}
        >
          <Text style={styles.addRoomText}>+ novo ambiente</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: Typography.mono,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.stone,
  },
  arrowsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  arrowButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.paper,
  },
  arrowText: {
    fontFamily: Typography.inter,
    fontSize: 18,
    lineHeight: 20,
    color: Colors.navy,
    textAlign: 'center',
    marginTop: -2,
  },
  scrollView: {
    overflow: 'visible',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 14,
    paddingBottom: 10,
  },
  roomCard: {
    width: 220,
    borderRadius: 16,
    padding: 18,
    justifyContent: 'space-between',
    minHeight: 160,
  },
  roomCardDefault: {
    backgroundColor: Colors.paperDeep,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  roomCardSelected: {
    backgroundColor: Colors.navy,
    borderWidth: 1,
    borderColor: Colors.navy,
    ...Shadows.cardSelected,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  roomName: {
    fontFamily: Typography.fraunces,
    fontSize: 18,
    lineHeight: 22,
    flex: 1,
  },
  roomNameDefault: {
    color: Colors.navy,
  },
  roomNameSelected: {
    color: Colors.paper,
  },
  itemCount: {
    fontFamily: Typography.mono,
    fontSize: 11,
  },
  itemCountDefault: {
    color: Colors.textMuted,
  },
  itemCountSelected: {
    color: Colors.sandMuted,
  },
  roomTotal: {
    fontFamily: Typography.fraunces,
    fontSize: 22,
    lineHeight: 28,
    marginTop: 18,
    marginBottom: 12,
  },
  roomTotalDefault: {
    color: Colors.navy,
  },
  roomTotalSelected: {
    color: Colors.sand,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressTrackDefault: {
    backgroundColor: Colors.borderLight,
  },
  progressTrackSelected: {
    backgroundColor: Colors.navyAlpha15,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressFillDefault: {
    backgroundColor: Colors.teal,
  },
  progressFillSelected: {
    backgroundColor: Colors.sand,
  },
  boughtLabel: {
    fontFamily: Typography.mono,
    fontSize: 11,
  },
  boughtLabelDefault: {
    color: Colors.textMuted,
  },
  boughtLabelSelected: {
    color: Colors.sandSoft,
  },
  addRoomCard: {
    width: 150,
    minHeight: 160,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: Colors.borderDashed,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  addRoomText: {
    fontFamily: Typography.mono,
    fontSize: 12,
    color: Colors.teal,
    textAlign: 'center',
  },
});
