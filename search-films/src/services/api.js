import axios from 'axios';

const API_BASE_URL = 'http://symfony.mmi-troyes.fr:8319/api'; // URL de base de ton API

// --------------------- Acteurs ---------------------

// Récupérer tous les acteurs (avec pagination)
export async function getActors(page = 1) {
    try {
        const response = await axios.get(`${API_BASE_URL}/actors?page=${page}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des acteurs :', error);
        throw error;
    }
}

// Ajouter un nouvel acteur
export async function addActor(actorData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/actors`, actorData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'acteur :', error);
        throw error;
    }
}

// Mettre à jour un acteur existant
export async function updateActor(actorId, actorData) {
    try {
        const response = await axios.put(`${API_BASE_URL}/actors/${actorId}`, actorData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'acteur :', error);
        throw error;
    }
}

// Supprimer un acteur
export async function deleteActor(actorId) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/actors/${actorId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'acteur :', error);
        throw error;
    }
}

// **Ajouter**: Rechercher des acteurs selon un critère (ex: nom, prénom)
export async function searchActors(query) {
    try {
        const response = await axios.get(`${API_BASE_URL}/actors?search=${query}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la recherche des acteurs :', error);
        throw error;
    }
}

// --------------------- Films ---------------------

// Récupérer tous les films (avec pagination)
export async function getMovies(page = 1) {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies?page=${page}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des films :', error);
        throw error;
    }
}

// Ajouter un nouveau film
export async function addMovie(movieData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/movies`, movieData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du film :', error);
        throw error;
    }
}

// Mettre à jour un film existant
export async function updateMovie(movieId, movieData) {
    try {
        const response = await axios.put(`${API_BASE_URL}/movies/${movieId}`, movieData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du film :', error);
        throw error;
    }
}

// Supprimer un film
export async function deleteMovie(movieId) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/movies/${movieId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression du film :', error);
        throw error;
    }
}

// **Ajouter**: Rechercher des films selon un critère (ex: titre)
export async function searchMovies(query) {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies?search=${query}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la recherche des films :', error);
        throw error;
    }
}

// --------------------- Catégories ---------------------

// Récupérer toutes les catégories (avec pagination)
export async function getCategories(page = 1) {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories?page=${page}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
        throw error;
    }
}

// Ajouter une nouvelle catégorie
export async function addCategory(categoryData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/categories`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la catégorie :', error);
        throw error;
    }
}

// Mettre à jour une catégorie existante
export async function updateCategory(categoryId, categoryData) {
    try {
        const response = await axios.put(`${API_BASE_URL}/categories/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie :', error);
        throw error;
    }
}

// Supprimer une catégorie
export async function deleteCategory(categoryId) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/categories/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie :', error);
        throw error;
    }
}

// --------------------- Utilisateurs / Profil ---------------------

// Se connecter (authentification)
export async function login(credentials) {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        throw error;
    }
}

// Mettre à jour le profil de l'utilisateur
export async function updateProfile(profileData) {
    try {
        const response = await axios.put(`${API_BASE_URL}/profile`, profileData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil :', error);
        throw error;
    }
}
