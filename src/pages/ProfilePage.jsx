// src/pages/ProfilePage.jsx
import { useFavorites } from '../hooks/useFavorites';
import { Loader } from 'lucide-react';

// Buat komponen Card sederhana di sini atau impor dari komponen grid Anda
// Saya akan buatkan card sederhana di sini untuk kelengkapan.
function FavoriteRecipeCard({ recipe, onRecipeClick }) {
  return (
    <div 
      onClick={() => onRecipeClick(recipe.id, recipe.category)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-105"
    >
      <img src={recipe.image_url} alt={recipe.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          recipe.category === 'makanan' 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {recipe.category}
        </span>
        <h3 className="font-semibold text-lg mt-2 truncate">{recipe.name}</h3>
        <p className="text-sm text-gray-500 capitalize">{recipe.difficulty}</p>
      </div>
    </div>
  );
}

export default function ProfilePage({ onRecipeClick }) {
  // 👇 PANGGIL HOOK YANG SAMA
  // Hook ini sekarang akan mengambil dari cache jika ada
  const { favorites, loading, error } = useFavorites();

  return (
    <div className="p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Resep Favorit Saya
        </h1>

        {/* 1. Tampilkan Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-lg text-gray-600 ml-4">Memuat favorit...</p>
          </div>
        )}

        {/* 2. Tampilkan Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* 3. Tampilkan Data jika ada */}
        {!loading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map(recipe => (
              <FavoriteRecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onRecipeClick={onRecipeClick} 
              />
            ))}
          </div>
        )}

        {/* 4. Tampilkan jika data kosong */}
        {!loading && !error && favorites.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-10">
            <p className="text-gray-600 text-center text-lg">
              Anda belum memiliki resep favorit.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}