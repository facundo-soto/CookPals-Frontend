import React from 'react'
import "./recipes.css";
import { Link } from 'react-router-dom';

export default function Recipes(props) {
  const recipes = props.recipes;
  console.log("Recetasdasdas: ", recipes);
  
  return (
    <>
      {recipes.map((recipe, index) => {
        return <Link className="recipe" key={`recipe-${index}`} to={`/recipe/${recipe.id}`}>
          <div className="recipe-info">
            <div className="recipe-header">
              <h2 className="recipe-title">{recipe.title}</h2>
              <div className="save"><i className={`bx bx-md ${recipe.isSaved ? "bxs-archive-in" : "bx-archive-in"}`}></i></div>
            </div>
            <div className="recipe-ingredients"><b>Etiquetas:</b> {recipe.filters.map(filter => " " + filter)}</div>
            <div className="recipe-ingredients"><b>Contiene:</b> {recipe.ingredientsSelected.map(ing => " " + ing)}</div>
            <div className="recipe-numbers">
              <i className="bx bx-time-five"></i>
              <div className="time">{recipe.time} Minutos</div>
              <i className="bx bx-bowl-rice"></i>
              <div className="slices">{recipe.servings} Porciones</div>
            </div>
            <div className="recipe-bottom">
              <div className="recipe-author">Autor/a: {recipe.author}</div>
              <div className="recipe-calification">
                <i className="bx bxs-star bx-sm"></i>
                <div>{recipe.calification}</div>
              </div>
            </div>
          </div>
          <div className="recipe-image">
            <img alt="pollo" src={recipe.image} />
          </div>
        </Link>
      })}
    </>
  )
}
