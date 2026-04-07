import React, { useState, useEffect } from 'react';
import ModernSidebar from '../components/ModernSidebar';
import ModernTopNavbar from '../components/ModernTopNavbar';
import rewardService from '../services/rewardService';
import certificateService from '../services/certificateService';
import {
  ModernContainer,
  ModernGrid,
  ModernCard,
  ModernSection,
  ModernButton,
  ModernStatCard,
} from '../components/ModernComponents';
import { SkeletonGrid } from '../components/Skeletons';

const RewardShop = () => {
  const [rewardItems, setRewardItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasing, setPurchasing] = useState(null);
  const [userEcoPoints, setUserEcoPoints] = useState(0);

  useEffect(() => {
    fetchRewardItems();
  }, []);

  const fetchRewardItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await rewardService.getRewardItems();
      if (result.success) {
        setRewardItems(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error fetching reward items:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (itemId) => {
    setPurchasing(itemId);
    try {
      const result = await rewardService.purchaseReward(itemId);
      if (result.success) {
        setUserEcoPoints(result.data.ecoPoints);
        // Update the item as purchased
        setRewardItems(prev => prev.map(item =>
          item._id === itemId ? { ...item, purchased: true } : item
        ));
        alert(`🎉 Successfully purchased ${result.data.item.name}!`);
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch (err) {
      console.error('Error purchasing item:', err);
      alert('Failed to complete purchase. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      await certificateService.downloadCertificate();
    } catch (err) {
      console.error('Error downloading certificate:', err);
      alert('Failed to download certificate. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Top Navbar */}
      <ModernTopNavbar />

      {/* Main Layout */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <ModernSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto pl-64">
          <ModernContainer className="py-8 space-y-8">
            {/* Header */}
            <ModernSection
              title="🎁 Reward Shop"
              subtitle="Spend your eco-points on exclusive rewards and unlock special items"
            />

            {/* Certificate Section */}
            <ModernSection title="🏆 Eco Excellence Certificate">
              <ModernCard>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📜</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Certificate of Eco Excellence
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Available after reaching 1000 eco-points. Download your certificate to showcase your environmental commitment!
                  </p>
                  <ModernButton
                    variant="primary"
                    size="lg"
                    onClick={handleDownloadCertificate}
                    className="px-8 py-3"
                  >
                    📥 Download Certificate
                  </ModernButton>
                </div>
              </ModernCard>
            </ModernSection>

            {/* Loading State */}
            {loading && (
              <ModernCard>
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-600" />
                  <p className="ml-4 text-gray-600">Loading reward shop...</p>
                </div>
              </ModernCard>
            )}

            {/* Error State */}
            {error && !loading && (
              <ModernCard>
                <div className="bg-red-50 border border-red-300 rounded-lg p-6 text-red-700">
                  <p className="font-semibold">⚠️ {error}</p>
                  <button
                    onClick={fetchRewardItems}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </ModernCard>
            )}

            {/* Reward Items Grid */}
            {!loading && !error && rewardItems.length > 0 && (
              <ModernSection
                title={`Available Rewards (${rewardItems.length})`}
                subtitle="Unlock exclusive items with your eco-points"
              >
                <ModernGrid columns={3}>
                  {rewardItems.map((item) => (
                    <ModernCard key={item._id} interactive>
                      {/* Top Bar */}
                      <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500 -mx-6 -mt-6 mb-4" />

                      {/* Item Icon */}
                      <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>

                      {/* Item Info */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Cost */}
                      <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs font-semibold text-green-700">
                          Cost: 💚 {item.cost} eco-points
                        </p>
                      </div>

                      {/* Purchase Button */}
                      <ModernButton
                        variant={item.purchased ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => !item.purchased && handlePurchase(item._id)}
                        disabled={item.purchased || purchasing === item._id}
                        className="w-full"
                      >
                        {purchasing === item._id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Purchasing...
                          </div>
                        ) : item.purchased ? (
                          '✓ Owned'
                        ) : (
                          'Purchase'
                        )}
                      </ModernButton>
                    </ModernCard>
                  ))}
                </ModernGrid>
              </ModernSection>
            )}

            {/* Empty State */}
            {!loading && !error && rewardItems.length === 0 && (
              <ModernCard>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎁</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rewards Available</h3>
                  <p className="text-gray-600 mb-6">Check back soon for new reward items!</p>
                </div>
              </ModernCard>
            )}
          </ModernContainer>
        </main>
      </div>
    </div>
  );
};

export default RewardShop;