import React, { useEffect, useState } from 'react'
import Recipes from '../../components/recipes/recipes'
import { useAuth } from '../../context/AuthContext'
import LocalLoading from '../../components/localLoading/localLoading';
import "./explore.css";

export default function Explore() {
    const { getRecipes } = useAuth();
    const [recipes, setRecipes] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            const fetchedRecipes = await getRecipes();
            setRecipes(fetchedRecipes);
        };

        fetchRecipes();
    }, [getRecipes]);
  return (
    <>
        <div className="main-box recipes-container">
            {recipes ? <Recipes recipes={recipes} /> : <LocalLoading />}
        </div>
    </>
  )
}
