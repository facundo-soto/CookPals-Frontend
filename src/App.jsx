import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/navbar/navbar';
import Auth from './pages/auth/auth';
import Profile from './pages/profile/profile';
import Alert from './components/alert/alert';
import CreateRecipe from './pages/create-recipe/create-recipe'
import Explore from './pages/explore/explore';
import Recipe from './pages/recipe/recipe';
import ProtectedRoute from './context/protectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Alert />
        <Navbar />
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/auth" element={<ProtectedRoute element={<Auth />} reqUser={false} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} reqUser={true} />} />
          <Route path="/explore" element={<ProtectedRoute element={<Explore />} />} />
          <Route path="/create-recipe" element={<ProtectedRoute element={<CreateRecipe />} reqUser={true} reqVerification={true} />} />
          <Route path="/recipe/:recipeId" element={<ProtectedRoute element={<Recipe />} />} reqUser={true} reqVerification={true} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}