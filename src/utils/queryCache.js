// src/utils/queryCache.js
// Cache sederhana di dalam memori dengan Time-To-Live (TTL)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 menit (dalam milidetik)

export const queryCache = {
  /**
   * Mengambil data dari cache berdasarkan key.
   * @param {string} key Kunci unik untuk data.
   * @returns {any|null} Data jika ada dan tidak kedaluwarsa, atau null.
   */
  get: (key) => {
    const item = cache.get(key);
    if (!item) return null; // Cache miss (data tidak ada)

    // Cek apakah data sudah kedaluwarsa
    const isExpired = (new Date() - item.timestamp) > CACHE_TTL;
    if (isExpired) {
      cache.delete(key);
      return null; // Cache expired
    }

    console.log(`[Cache] HIT: ${key}`);
    return item.data; // Cache hit (data ditemukan)
  },

  /**
   * Menyimpan data ke cache.
   * @param {string} key Kunci unik untuk data.
   * @param {any} data Data yang ingin disimpan.
   */
  set: (key, data) => {
    console.log(`[Cache] SET: ${key}`);
    const item = {
      data: data,
      timestamp: new Date(),
    };
    cache.set(key, item);
  },

  /**
   * Menghapus/membersihkan cache tertentu agar data di-fetch ulang.
   * @param {string} key Kunci cache yang ingin dihapus.
   */
  invalidate: (key) => {
    console.log(`[Cache] INVALIDATE: ${key}`);
    cache.delete(key);
  },

  /**
   * Menghapus semua cache.
   */
  invalidateAll: () => {
    console.log(`[Cache] INVALIDATE ALL`);
    cache.clear();
  }
};