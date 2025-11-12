// src/main.jsx
import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import SplashScreen from './pages/SplashScreen';
import HomePage from './pages/HomePage';
import MakananPage from './pages/MakananPage';
import MinumanPage from './pages/MinumanPage';
import ProfilePage from './pages/ProfilePage';
import CreateRecipePage from './pages/CreateRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import RecipeDetail from './components/recipe/RecipeDetail';
import DesktopNavbar from './components/navbar/DesktopNavbar';
import MobileNavbar from './components/navbar/MobileNavbar';
import './index.css'
import PWABadge from './PWABadge';

function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [mode, setMode] = useState('list'); // 'list', 'detail', 'create', 'edit'
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('makanan');
  const [editingRecipeId, setEditingRecipeId] = useState(null);

  // 👇 EFEK INI MEMBACA URL SAAT APLIKASI DIBUKA (PENTING UNTUK SHARE)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recipeIdFromUrl = params.get('recipe');
    const categoryFromUrl = params.get('category');

    if (recipeIdFromUrl) {
      setSelectedRecipeId(recipeIdFromUrl);
      setSelectedCategory(categoryFromUrl || 'makanan');
      setMode('detail');
    }
  }, []); // Hanya berjalan sekali

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // 👇 FUNGSI INI MEMBERSIHKAN URL
  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
    // Hapus parameter ?recipe=... dari URL
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleCreateRecipe = () => {
    setMode('create');
  };

  // 👇 FUNGSI INI MENGATUR URL
  const handleRecipeClick = (recipeId, category) => {
    // Pelindung jika recipeId tidak ada
    if (!recipeId) {
      console.error("handleRecipeClick dipanggil tanpa recipeId");
      return; 
    }

    const validCategory = category || currentPage || 'makanan';
    
    setSelectedRecipeId(recipeId);
    setSelectedCategory(validCategory);
    setMode('detail');
    
    // Buat URL baru untuk di-share
    const params = new URLSearchParams();
    params.set('recipe', recipeId);
    params.set('category', validCategory);
    // Update URL di browser tanpa me-reload halaman
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  const handleEditRecipe = (recipeId) => {
    console.log('🔧 Edit button clicked! Recipe ID:', recipeId);
    setEditingRecipeId(recipeId);
    setMode('edit');
    console.log('✅ Mode changed to: edit');
  };

  // 👇 FUNGSI INI MEMBERSIHKAN URL
  const handleBack = () => {
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
    // Hapus parameter ?recipe=... dari URL
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleCreateSuccess = (newRecipe) => {
    alert('Resep berhasil dibuat!');
    setMode('list');
    if (newRecipe && newRecipe.category) {
      setCurrentPage(newRecipe.category);
    }
  };

  const handleEditSuccess = (updatedRecipe) => {
    alert('Resep berhasil diperbarui!');
    setMode('list');
  };

  const renderCurrentPage = () => {
    // Show Create Recipe Page
    if (mode === 'create') {
      return (
        <CreateRecipePage
          onBack={handleBack}
          onSuccess={handleCreateSuccess}
        />
      );
    }

    // Show Edit Recipe Page
    if (mode === 'edit') {
      return (
        <EditRecipePage
          recipeId={editingRecipeId}
          onBack={handleBack}
          onSuccess={handleEditSuccess}
        />
      );
    }

    // Show Recipe Detail
    if (mode === 'detail') {
      return (
        <RecipeDetail
          recipeId={selectedRecipeId}
          category={selectedCategory}
          onBack={handleBack}
          onEdit={handleEditRecipe}
        />
      );
    }

    // Show List Pages
    switch (currentPage) {
      case 'home':
        return <HomePage onRecipeClick={handleRecipeClick} onNavigate={handleNavigation} />;
      case 'makanan':
        return <MakananPage onRecipeClick={handleRecipeClick} />;
      case 'minuman':
        return <MinumanPage onRecipeClick={handleRecipeClick} />;
      case 'profile':
        // 👇 INI PERBAIKANNYA: KEMBALIKAN onRecipeClick
        return <ProfilePage onRecipeClick={handleRecipeClick} />;
      default:
        return <HomePage onRecipeClick={handleRecipeClick} onNavigate={handleNavigation} />;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show navbar in list mode */}
      {mode === 'list' && (
        <>
          <DesktopNavbar 
            currentPage={currentPage} 
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
          <MobileNavbar 
            currentPage={currentPage} 
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
        </>
      )}
      
      {/* Main Content */}
      <main className="min-h-screen">
        {renderCurrentPage()}
      </main>

      <PWABadge />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
)