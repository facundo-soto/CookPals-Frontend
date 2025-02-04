import React, { useState } from 'react';
import './create-recipe.css'
import { useAuth } from '../../context/AuthContext';

export default function CreateRecipe() {
  const { submitRecipe } = useAuth();
  const [image, setImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const [recipeData, setRecipeData] = useState({
    title: '',
    description: '',
    time: 0,
    servings: 0
  });

  const handleRecipeDataChange = (e) => {
    const { name, value } = e.target;
    setRecipeData({ ...recipeData, [name]: value });
  }

  const [ingredientsPrompt, setIngredientsPrompt] = useState(['']);
  const [steps, setSteps] = useState(['']);

  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState(1);

  const filters = ["Vegano", "Sin gluten", "Desayuno", "Almuerzo", "Merienda", "Cena", "Bebida", "Bajas calorías"];
  const [filtersSelected, setFiltersSelected] = useState([]);
  const ingredients = ["Pollo", "Carne", "Pescado", "Lechuga", "Pan", "Tomate", "Harina", "Agua", "Aceite", "Chocolate", "Huevo", "Salchicha"];
  const [ingredientsSelected, setIngredientsSelected] = useState([]);

  const handleIngredientsSelectedChange = (ingredient) => {
    let updatedIngredients = [...ingredientsSelected];
    if (ingredientsSelected.includes(ingredient)) {
      updatedIngredients = updatedIngredients.filter(element => element !== ingredient);
    }
    else {
      updatedIngredients.push(ingredient);
    }
    setIngredientsSelected(updatedIngredients);
  }

  const handleFiltersChange = (filter) => {
    let updatedFilters = [...filtersSelected];
    if (filtersSelected.includes(filter)) {
      updatedFilters = updatedFilters.filter(element => element !== filter);
    }
    else {
      updatedFilters.push(filter);
    }
    setFiltersSelected(updatedFilters);
  }

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...ingredientsPrompt];
    updatedIngredients[index] = value;
    setIngredientsPrompt(updatedIngredients);
  };
  const addIngredient = () => {
    setIngredientsPrompt([...ingredientsPrompt, '']);
  };
  const removeIngredient = (index) => {
    const updatedIngredients = ingredientsPrompt.filter((_, i) => i !== index);
    setIngredientsPrompt(updatedIngredients);
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  }
  const addStep = () => {
    setSteps([...steps, '']);
  };
  const removeStep = (index) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    setSteps(updatedSteps);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      setImage(file);
    }
  }

  const handleRecipeSubmit = () => {
    const recipe = {
      ...recipeData,
      ingredients: ingredientsPrompt,
      steps: steps,
      filters: filtersSelected,
      ingredientsSelected: ingredientsSelected
    }
    submitRecipe(recipe, image);
  }

  return (
    <>
      {showFilters && (
        <div className="absolute-bg">
          <div className="absolute-box filters-box">
            <i className="bx bx-x color-sk exit-icon" onClick={() => setShowFilters(false)}></i>
            <div className="options">
              <span className={selected === 1 ? "selected" : ""} onClick={() => setSelected(1)}>Filtros</span>
              <span className={selected === 2 ? "selected" : ""} onClick={() => setSelected(2)}>Ingredientes</span>
            </div>
            {selected === 1 ? (
              <div className="filters">
                {filters.map(filter => (
                  <div className="filter">
                    <i className={`bx ${filtersSelected.includes(filter) ? "bx-checkbox-checked" : "bx-checkbox"} color-sk`} onClick={() => handleFiltersChange(filter)}></i>
                    <span>{filter}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="filters">
                {ingredients.map(ingredient => (
                  <div className="filter">
                    <i className={`bx ${ingredientsSelected.includes(ingredient) ? "bx-checkbox-checked" : "bx-checkbox"} color-sk`} onClick={() => handleIngredientsSelectedChange(ingredient)}></i>
                    <span>{ingredient}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="create-recipe main-box">
        <div className="image-container">
          <input type="file" className="vanish" id="recipe-image" onChange={handleImageChange} />
          <label htmlFor="recipe-image" className="image-label">
            {image ? (<>
              <div className="overlay"></div>
              <i className="bx bxs-edit-alt overlay-icon"></i>
              <img className="recipe-image" src={imageSrc} alt="Imagen de la receta" />
            </>) : (<div className="default-image">
              <i className="bx bx-image-alt default-image-icon"></i>
              <div className="title">Agregue una imagen</div>
            </div>)}
          </label>
        </div>
        <div className="create-recipe-form">
          <input className="input recipe-title" type="text" placeholder="Título" name="title" value={recipeData.title} onChange={handleRecipeDataChange} />
          <textarea type="text" className="input" placeholder="Descripción" name="description" value={recipeData.description} onChange={handleRecipeDataChange} />
          <div className="recipe-numbers">
            <div>
              <i className="bx bx-time-five"></i>
              <input type="number" min={0} className="input" placeholder="Tiempo (en minutos)" name="time" onChange={handleRecipeDataChange} />
            </div>
            <div>
              <input type="number" min={1} className="input" placeholder="Porciones" name="servings" onChange={handleRecipeDataChange} />
              <i className="bx bx-bowl-rice"></i>
            </div>
          </div>
          <div className="recipe-ingredients">
            {ingredientsPrompt.map((ingredient, index) => (
              <div key={`ingredient-${index}`} className="recipe-ingredient">
                <input type="text" className="input" placeholder={`Ingrediente número ${index + 1}`} value={ingredient} onChange={(e) => handleIngredientChange(index, e.target.value)} />
                <i className="bx bx-trash color-sk" onClick={index === 0 && ingredientsPrompt.length === 1 ? null : () => removeIngredient(index)}></i>
              </div>
            ))}
            <button className="button" onClick={addIngredient}><i className="bx bx-plus"></i>Agregar ingrediente</button>
          </div>
          <div className="recipe-steps">
            {steps.map((step, index) => (
              <div key={`step-${index}`} className="recipe-ingredient">
                <input type="text" className="input" placeholder={`Paso número ${index + 1}`} value={step} onChange={(e) => handleStepChange(index, e.target.value)} />
                <i className="bx bx-trash color-sk" onClick={index === 0 && steps.length === 1 ? null : () => removeStep(index)}></i>
              </div>
            ))}
            <button className="button" onClick={addStep}><i className="bx bx-plus"></i>Agregar paso</button>
          </div>
          <div className="create-recipe-bottom">
            <button className="button" onClick={() => setShowFilters(true)}>Agregar filtros</button>
            <button className="button" onClick={handleRecipeSubmit}>Subir receta</button>
          </div>
        </div>
      </div>
    </>
  )
}
