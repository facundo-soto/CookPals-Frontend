import React, { useEffect, useState } from 'react'
import Recipes from '../../components/recipes/recipes'
import { useAuth } from '../../context/AuthContext'
import Loading from '../../components/loading/loading';
import "./explore.css";

export default function Explore() {
    const { getRecipes } = useAuth();
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const fetchedRecipes = await getRecipes();
            setRecipes(fetchedRecipes);
        };

        fetchRecipes();
    }, [getRecipes]);
  return (
    <>
        <Loading />
        <div className="main-box recipes-container">
            <Recipes recipes={recipes} />
        </div>
    </>
  )
}
