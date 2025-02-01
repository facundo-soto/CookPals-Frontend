import React, { useEffect, useState } from 'react'
import './home.css'
import { useAuth } from '../../context/AuthContext'
import Recipes from '../../components/recipes/recipes';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user, getRecipes, getBestRecipes } = useAuth();
  const [recipes, setRecipes] = useState(null);
  const [bestRecipes, setBestRecipes] = useState(null);
  const [recipesShowed, setRecipesShowed] = useState([false, false])

  useEffect(() => {
    const fetchRecipes = async () => {
      const fetchedRecipes = await getRecipes();
      setRecipes(fetchedRecipes);
    };
    const fetchBestRecipes = async () => {
      const fetchedBestRecipes = await getBestRecipes();
      setBestRecipes(fetchedBestRecipes);
    };
    fetchBestRecipes();
    fetchRecipes();
  }, [getRecipes, getBestRecipes]);

  const toggleRecipes = (index) => {
    const newRecipesShowed = [...recipesShowed];
    newRecipesShowed[index] = !newRecipesShowed[index];
    setRecipesShowed(newRecipesShowed);
    console.log(recipes);
  }

  return (
    <>
      <div className="home-image">
        <div>
          <img src="/cookpals-logotipe.png" alt="" />
          <span className="home-title">Bienvenido a CookPals</span>
          <span className="home-desc">¡Tu sitio favorito para ver y compartir recetas!</span>
        </div>
      </div>
      <div className="recipes-container">
        {user ? (<>
          <section className="recipes-section">
          <div className="section-title">Recetas</div>
          {recipes ? (<>
            {recipes.length > 0 ? (<>
              {recipesShowed[0] ? (<>
                <Recipes recipes={recipes} />
                <i className="bx bx-chevron-up section-icon color-sk" onClick={() => toggleRecipes(0)}></i>
              </>) : (<>
                <Recipes recipes={[recipes[0]]} />
                <i className="bx bx-chevron-down section-icon color-sk" onClick={() => toggleRecipes(0)}></i>
              </>)}
            </>) : (<>
              <Recipes recipes={recipes} />
            </>)}
          </>) : <div className="no-content">Cargando...</div>}
        </section>
        <section className="recipes-section">
          <div className="section-title">Las 3 mejor calificadas</div>
          {bestRecipes ? (<>
            {bestRecipes.length > 0 ? (<>
              {recipesShowed[1] ? (<>
                <Recipes recipes={bestRecipes} />
                <i className="bx bx-chevron-up section-icon color-sk" onClick={() => toggleRecipes(1)}></i>
              </>) : (<>
                <Recipes recipes={[bestRecipes[0]]} />
                <i className="bx bx-chevron-down section-icon color-sk" onClick={() => toggleRecipes(1)}></i>
              </>)}
            </>) : (<>
              <Recipes recipes={bestRecipes} />
            </>)}
          </>) : <div className="no-content">Cargando...</div>}
        </section>
        </>) : (<>
          <div className="no-content">Inicie sesión para ver las recomendaciones</div>
          <Link to="/auth" className="button-login"><button className="button">Iniciar sesión</button></Link>
        </>)}
      </div>
    </>
  )
}
