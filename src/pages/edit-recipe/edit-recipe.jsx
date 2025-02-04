import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useParams, useNavigate } from 'react-router-dom'


export default function EditRecipe() {
    const { recipeId } = useParams();
    const { user, getRecipeById, handleAlert, editRecipe } = useAuth();
    const [recipeData, setRecipeData] = useState(null);
    const navigate = useNavigate();

    const [newImage, setNewImage] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);

    const [ingredientsPrompt, setIngredientsPrompt] = useState(null);
    const [steps, setSteps] = useState(null);

    const [showFilters, setShowFilters] = useState(false);
    const [selected, setSelected] = useState(1);

    const filters = ["Vegano", "Sin gluten", "Desayuno", "Almuerzo", "Merienda", "Cena", "Bebida", "Bajas calorías"];
    const [filtersSelected, setFiltersSelected] = useState(null);
    const ingredients = ["Pollo", "Carne", "Pescado", "Lechuga", "Pan", "Tomate", "Harina", "Agua", "Aceite", "Chocolate", "Huevo", "Salchicha"];
    const [ingredientsSelected, setIngredientsSelected] = useState(null);

    useEffect(() => {
        const getRecipe = async () => {
            const recipe = await getRecipeById(recipeId);
            if (recipe.author !== user.uid) {
                handleAlert(false, "No puede editar una receta que no es suya");
                navigate('/profile');
            } else {
                setRecipeData({
                    id: recipeId,
                    title: recipe.title,
                    description: recipe.description,
                    time: recipe.time,
                    servings: recipe.servings
                });
                setImageSrc(recipe.image);
                setIngredientsPrompt(recipe.ingredients);
                setSteps(recipe.steps);
                setFiltersSelected(recipe.filters);
                setIngredientsSelected(recipe.ingredientsSelected)
            }
        }
        user?.uid && recipeId && getRecipe();
    }, [user, getRecipeById, recipeId, navigate]);

    const handleRecipeDataChange = (e) => {
        const { name, value } = e.target;
        setRecipeData({ ...recipeData, [name]: value });
    }

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
            setNewImage(file);
        }
    }

    const handleNewRecipeSubmit = () =>{
        const newRecipe = {
            ...recipeData,
            ingredients: ingredientsPrompt,
            steps: steps,
            filters: filtersSelected,
            ingredientsSelected: ingredientsSelected
        }
        if(!newImage){
            newRecipe.image = imageSrc;
        }
        editRecipe(newRecipe, newImage)
    }

    return (
        <>
            {recipeData ? (<>
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
                            <div className="overlay"></div>
                            <i className="bx bxs-edit-alt overlay-icon"></i>
                            <img className="recipe-image" src={imageSrc} alt="Imagen de la receta" />
                        </label>
                    </div>
                    <div className="create-recipe-form">
                        <input className="input recipe-title" type="text" placeholder="Título" name="title" value={recipeData.title} onChange={handleRecipeDataChange} />
                        <textarea type="text" className="input" placeholder="Descripción" name="description" value={recipeData.description} onChange={handleRecipeDataChange} />
                        <div className="recipe-numbers">
                            <div>
                                <i className="bx bx-time-five"></i>
                                <input type="number" min={0} className="input" value={recipeData.time} placeholder="Tiempo (en minutos)" name="time" onChange={handleRecipeDataChange} />
                            </div>
                            <div>
                                <input type="number" min={1} className="input" value={recipeData.servings} placeholder="Porciones" name="servings" onChange={handleRecipeDataChange} />
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
                            <button className="button" onClick={handleNewRecipeSubmit}>Subir receta</button>
                        </div>
                    </div>
                </div>
            </>) : (<>
                <div className="no-content">Cargando...</div>
            </>)}
        </>
    )
}
