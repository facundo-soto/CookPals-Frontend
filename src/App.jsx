import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/page';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/navbar/navbar';
import Auth from './pages/auth/auth';
import Profile from './pages/profile/profile';
import Alert from './components/alert/alert';
import CreateRecipe from './pages/create-recipe/create-recipe'
import Explore from './pages/explore/explore';
import Recipe from './pages/recipe/recipe';

export default function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Alert />
      <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/recipe/:recipeId" element={<Recipe />} />
        </Routes>
    </AuthProvider>
    </BrowserRouter>
  )
}