import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './recipe.css'
import { useAuth } from '../../context/AuthContext';
import LocalLoading from '../../components/localLoading/localLoading';


export default function Recipe() {
    const { recipeId } = useParams();
    const { user, getRecipeById, submitComment, saveRecipe, unsaveRecipe } = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [newComment, setNewComment] = useState({ text: "", stars: 0 });
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        setNewComment(isEditing ? { text: "", stars: 0 } : recipe.userComment);
        setIsEditing(!isEditing);
    }

    useEffect(() => {
        const getRecipe = async () => {
            const recipe = await getRecipeById(recipeId);
            recipe.userComment = recipe.comments.find(comment => comment.userId === user.uid) ?? false;
            recipe.comments = recipe.comments.filter(comment => comment.userId !== user.uid);
            setRecipe(recipe);
        }
        user?.uid && recipeId && getRecipe();
    }, [user, getRecipeById, recipeId]);

    const handleCommentSubmit = async () => {
        await submitComment(recipeId, newComment);
    }
    const handleCommentDelete = async () =>{
        await submitComment(recipeId, {delete: true});
    }

    return (
        <>
            {recipe ? (<>
                <div className="recipe-container main-box">
                    <div className="image-container">
                        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                    </div>
                    <div className="recipe-content">
                        <div className="recipe-title title">{recipe.title}</div>
                        <div className="recipe-calification">{recipe.calification.toFixed(1)}</div>
                        <div className="recipe-stars">
                            {[1, 2, 3, 4, 5].map(star => (
                                <i className={star <= recipe.calification ? "bx bxs-star color-sk no-hover" : "bx bx-star color-sk no-hover"}></i>
                            ))}
                        </div>
                        <div className="recipe-description"><b>Descripción:</b>{recipe.description}</div>
                        <div className="recipe-author"><b>Autor/a:</b>{recipe.authorName}</div>
                        <div className="recipe-tags overflow">
                            <b>Etiquetas:</b>
                            {recipe.filters.map((tag, index) => (
                                <>{index !== 0 ? <i className="bx bxs-circle"></i> : <></>} {tag}</>
                            ))}
                        </div>
                        <div className="recipe-numbers">
                            <div className="recipe-time">
                                <i className="bx bx-time-five"></i>
                                <span>{recipe.time} minutos</span>
                            </div>
                            <div className="recipe-servings">
                                <i className="bx bx-bowl-rice"></i>
                                <span>{recipe.servings} porciones</span>
                            </div>
                        </div>
                        <div className="recipe-recipe">
                            <b>Receta</b>
                        </div>
                        <div className="recipe-ingredients">
                            <div><b>Ingredientes:</b></div>
                            {recipe.ingredients.map(ingredient => (
                                <div className="ingredient">
                                    <i className="bx bxs-circle"></i>
                                    <span>{ingredient}</span>
                                </div>
                            ))}
                        </div>
                        <div className="recipe-steps">
                            <div><b>Pasos:</b></div>
                            {recipe.steps.map((step, index) => (
                                <div className="step">
                                    <b>{index + 1}</b>
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>
                        <div className="recipe-buttons">
                            {recipe.isAuthor ? <button className="button">Editar receta</button> : <div></div>}
                            {recipe.isSaved ? <button className="button" onClick={() => unsaveRecipe(recipeId)}>Eliminar de guardados</button> : <button className="button" onClick={() => saveRecipe(recipeId, true)}>Guardar receta</button>}
                        </div>
                    </div>
                </div>
                <div className="main-box comments-title comments-container">
                    <div className="title">Comentarios</div>
                </div>
                <div className="main-box comments-container">
                    {((!recipe.isAuthor && !recipe.hasCommented) || isEditing) && (
                        <div className="comment comment-form">
                            <div className="user">
                                <img src={user ? user.image : ""} alt={user.displayName} className="user-image" />
                                <div className="user-name">{user ? user.name : ""}</div>
                            </div>
                            <div className="comment-stars">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <i className={star <= newComment.stars ? "bx bxs-star color-sk" : "bx bx-star color-sk"} onClick={() => setNewComment({ ...newComment, stars: star })}></i>
                                ))}
                            </div>
                            <textarea type="text" value={newComment.text} className="comment-text input" placeholder="Añade un comentario..." onChange={(e) => setNewComment({ ...newComment, text: e.target.value })} />
                            <div className="comment-options">
                                <button className="button" onClick={handleCommentSubmit}>Subir comentario</button>
                                {isEditing && <button className="button" onClick={toggleEdit}>Cancelar</button>}
                            </div>
                        </div>
                    )}
                    {recipe.userComment && !isEditing && (<>
                        <div className="comment user-comment">
                            <div className="user">
                                <img src={recipe.userComment.userImage} alt={recipe.userComment.userName} className="user-image" />
                                <div className="user-name">{recipe.userComment.userName}</div>
                            </div>
                            <div className="comment-stars">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <i className={star <= recipe.userComment.stars ? "bx bxs-star color-sk no-hover" : "bx bx-star color-sk no-hover"}></i>
                                ))}
                            </div>
                            <div className="comment-text">{recipe.userComment.text}</div>
                            <div className="comment-options">
                                <button className="button" onClick={toggleEdit}>Editar comentario</button>
                                <button className="button" onClick={handleCommentDelete}>Eliminar comentario</button>
                            </div>
                        </div>
                    </>)}

                    {recipe.comments?.length > 0 ? recipe.comments.map(comment => (
                        <div className="comment">
                            <div className="user">
                                <img src={comment.userImage} alt={comment.userName} className="user-image" />
                                <div className="user-name">{comment.userName}</div>
                            </div>
                            <div className="comment-stars">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <i className={star <= comment.stars ? "bx bxs-star color-sk no-hover" : "bx bx-star color-sk no-hover"}></i>
                                ))}
                            </div>
                            <div className="comment-text">{comment.text}</div>
                        </div>
                    )) : <div className="no-content">No hay comentarios</div>}
                </div>
            </>) : <LocalLoading />}
        </>
    )
}
