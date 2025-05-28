import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import MealCard from '../components/MealCard';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';
import { MealBox } from '../types';
import { WifiOff, Search } from 'lucide-react';

const mealBoxes: MealBox[] = [
  {
    title: "Regular Chicken Biryani",
    description: "Classic Hyderabadi biryani with tender chicken pieces",
    emoji: "🍗",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
    price: 10
  },
  {
    title: "Extra Meat Chicken Biryani",
    description: "Our signature biryani loaded with extra chicken pieces",
    emoji: "🍖",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
    price: 12,
    tags: ["Pre-Order Required"]
  },
  {
    title: "Andhra Chicken",
    description: "Spicy Andhra style chicken curry with authentic spices and herbs",
    emoji: "🌶️",
    bg: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
    price: 12
  },
  {
    title: "Kadai Chicken",
    description: "Tender chicken cooked with bell peppers in a rich tomato gravy",
    emoji: "🍗",
    bg: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
    price: 12
  },
  {
    title: "Kadai Paneer",
    description: "Fresh cottage cheese with bell peppers in aromatic spices",
    emoji: "🧀",
    bg: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
    price: 12
  },
  {
    title: "Okra Masala",
    description: "Crispy okra tossed with onions and Indian spices",
    emoji: "🥬",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    price: 12,
    isNew: true
  },
  {
    title: "Bisi Bele Bath",
    description: "Traditional Karnataka style spicy rice with lentils and vegetables",
    emoji: "🍚",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
    price: 12,
    isNew: true
  }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    reviews, 
    loading, 
    submitReview, 
    updateReview, 
    deleteReview, 
    getAverageRating,
    offline 
  } = useReviews(mealBoxes);

  const filteredMealBoxes = useMemo(() => {
    return mealBoxes.filter(mealBox => {
      const matchesSearch = searchQuery === '' || 
        mealBox.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mealBox.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery]);

  return (
    <Layout>
      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            Welcome to <span className="text-amber-600 dark:text-amber-500">Biryani Boyz</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience the authentic flavors of India with our carefully curated menu.
          </p>
          
          {offline && (
            <div className="mt-4 flex items-center justify-center gap-2 text-amber-600 dark:text-amber-500">
              <WifiOff className="w-4 h-4" />
              <span className="text-xs">You're offline. Changes will sync when you're back online.</span>
            </div>
          )}

          {/* Search Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search meals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {filteredMealBoxes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-600 dark:text-gray-400">
                  No meals found matching your search criteria.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredMealBoxes.map((meal) => (
                  <MealCard
                    key={meal.title}
                    meal={meal}
                    reviews={reviews[meal.title] || []}
                    averageRating={getAverageRating(meal.title)}
                    user={user}
                    onSubmitReview={(comment, rating) => submitReview(meal.title, comment, rating)}
                    onUpdateReview={(reviewId, comment, rating) => 
                      updateReview(meal.title, reviewId, comment, rating)
                    }
                    onDeleteReview={(reviewId) => deleteReview(meal.title, reviewId)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;