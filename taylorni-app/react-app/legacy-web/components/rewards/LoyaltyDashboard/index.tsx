import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import rewardsService from '../../../services/rewards/rewardsService';
import { LoyaltyPoints, Reward } from '../../../types/rewards.types';
import PointsCard from './PointsCard';
import TierProgress from './TierProgress';
import RewardsGrid from './RewardsGrid';
import styles from './styles';

interface LoyaltyDashboardProps {
  userId: string;
}

const LoyaltyDashboard: React.FC<LoyaltyDashboardProps> = ({ userId }) => {
  const [points, setPoints] = useState<LoyaltyPoints | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      const [pointsData, rewardsData] = await Promise.all([
        rewardsService.getLoyaltyPoints(userId),
        rewardsService.getAvailableRewards(userId),
      ]);
      setPoints(pointsData);
      setRewards(rewardsData);
    } catch (error) {
      console.error('Load rewards data error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleRedeemReward = async (rewardId: string) => {
    try {
      await rewardsService.redeemReward(userId, rewardId);
      // Show success message
      loadData(); // Refresh data
    } catch (error) {
      console.error('Redeem error:', error);
      // Show error message
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading rewards...</Text>
      </View>
    );
  }

  const tierProgress = points
    ? rewardsService.getNextTierProgress(points.total)
    : null;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rewards Program</Text>
        <TouchableOpacity style={styles.historyButton}>
          <Ionicons name="time-outline" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {/* Points Card */}
      {points && <PointsCard points={points} />}

      {/* Tier Progress */}
      {tierProgress && <TierProgress {...tierProgress} />}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="share-social-outline" size={24} color="#6366f1" />
          <Text style={styles.actionTitle}>Refer & Earn</Text>
          <Text style={styles.actionSubtitle}>+500 points</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="star-outline" size={24} color="#6366f1" />
          <Text style={styles.actionTitle}>Write Review</Text>
          <Text style={styles.actionSubtitle}>+50 points</Text>
        </TouchableOpacity>
      </View>

      {/* Available Rewards */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Rewards</Text>
          <Text style={styles.sectionSubtitle}>
            {rewards.length} rewards available
          </Text>
        </View>
        <RewardsGrid
          rewards={rewards}
          availablePoints={points?.available || 0}
          onRedeem={handleRedeemReward}
        />
      </View>

      {/* How It Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Earn Points</Text>
        <View style={styles.earnMethodsList}>
          <EarnMethod icon="cart-outline" title="Shop" points="1 pt / $1" />
          <EarnMethod
            icon="person-add-outline"
            title="Refer Friends"
            points="500 pts"
          />
          <EarnMethod icon="star-outline" title="Write Reviews" points="50 pts" />
          <EarnMethod
            icon="share-social-outline"
            title="Share on Social"
            points="25 pts"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const EarnMethod: React.FC<{
  icon: string;
  title: string;
  points: string;
}> = ({ icon, title, points }) => (
  <View style={styles.earnMethod}>
    <View style={styles.earnMethodIcon}>
      <Ionicons name={icon as any} size={20} color="#6366f1" />
    </View>
    <View style={styles.earnMethodContent}>
      <Text style={styles.earnMethodTitle}>{title}</Text>
      <Text style={styles.earnMethodPoints}>{points}</Text>
    </View>
  </View>
);

export default LoyaltyDashboard;
