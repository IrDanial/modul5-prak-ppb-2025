// src/hooks/useFavorites.js
import { useState, useEffect, useCallback } from 'react';
import favoriteService from '../services/favoriteService';
import userService from '../services/userService';
import { queryCache } from '../utils/queryCache'; // 👈 IMPORT CACHE

/**
 * Get user identifier from localStorage or generate new one
 */
const getUserIdentifier = () => {
  return userService.getUserIdentifier();
};

/**
 * Custom hook for fetching favorites
 * @returns {Object} - { favorites, loading, error, refetch }
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userIdentifier = getUserIdentifier();
  const cacheKey = `favorites_${userIdentifier}`; // 👈 Buat kunci cache unik

  const fetchFavorites = useCallback(async (options = {}) => {
    const { forceRefetch = false } = options;

    try {
      setLoading(true);
      setError(null);
      
      // Cek cache terlebih dahulu
      if (!forceRefetch) {
        const cachedData = queryCache.get(cacheKey);
        if (cachedData) {
          setFavorites(cachedData);
          setLoading(false);
          return; // Berhenti di sini, data dari cache
        }
      }

      // Jika tidak ada di cache, fetch ke API
      console.log(`[API] FETCH: ${cacheKey}`);
      [cite_start]const response = await favoriteService.getFavorites(userIdentifier); [cite: 284-288]
      
      if (response.success) {
        const data = response.data || [];
        setFavorites(data);
        // Simpan hasil fetch ke cache
        queryCache.set(cacheKey, data);
      } else {
        setError(response.message || 'Failed to fetch favorites');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [userIdentifier, cacheKey]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    // Modifikasi refetch agar bisa memaksa
    refetch: () => fetchFavorites({ forceRefetch: true }),
  };
}

/**
 * Custom hook for toggling favorites
 * @returns {Object} - { toggleFavorite, loading, error }
 */
export function useToggleFavorite() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userIdentifier = getUserIdentifier();
  const cacheKey = `favorites_${userIdentifier}`; // 👈 Buat kunci cache yang sama

  const toggleFavorite = async (recipeId) => {
    try {
      setLoading(true);
      setError(null);
      
      [cite_start]const response = await favoriteService.toggleFavorite({ [cite: 294-297]
        recipe_id: recipeId,
        user_identifier: userIdentifier,
      });
      
      if (response.success) {
        // PENTING: Hapus cache 'favorites' karena datanya sudah basi
        queryCache.invalidate(cacheKey);
        return response.data;
      } else {
        setError(response.message || 'Failed to toggle favorite');
        return null;
      }
    } catch (err) {
      setError(err.message || 'An error occurred while toggling favorite');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    toggleFavorite,
    loading,
    error,
  };
}

/**
 * Custom hook to check if a recipe is favorited
 * @param {string} recipeId - Recipe ID
 * @returns {Object} - { isFavorited, loading, toggleFavorite }
 */
export function useIsFavorited(recipeId) {
  const { favorites, loading: fetchLoading, refetch } = useFavorites();
  const { toggleFavorite: toggle, loading: toggleLoading } = useToggleFavorite();
  
  const isFavorited = favorites.some(fav => fav.id === recipeId);

  const toggleFavorite = async () => {
    const result = await toggle(recipeId);
    if (result) {
      // Panggil refetch (yang sekarang sudah dimodifikasi)
      // Ini akan memaksa useFavorites mengambil data baru dan memperbarui cache
      await refetch();
    }
    return result;
  };

  return {
    isFavorited,
    loading: fetchLoading || toggleLoading,
    toggleFavorite,
  };
}

export { getUserIdentifier };