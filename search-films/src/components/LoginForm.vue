<template>
  <div id="login-form">
    <div v-if="!loggedIn">
      <form @submit.prevent="onSubmit">
        <h1>{{ title }}</h1>
        <p>Remplissez ce formulaire pour vous connecter.</p>
        <hr>

        <label for="email"><b>Email</b></label>
        <input type="text" v-model="email" placeholder="Entrez votre courriel" id="email" name="email" required>

        <label for="psw"><b>Mot de passe</b></label>
        <input type="password" v-model="password" placeholder="Entrez votre mot de passe" id="psw" name="psw" required>

        <p><button type="submit">Se connecter</button></p>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>

    <div v-else>
      <ul class="films">
        <li v-for="(film, index) in films" :key="index" class="film card">
          <img class="poster" :src="film.poster" alt="Poster">
          <p class="title">
            {{ film.title }}
            <span class="rating">{{ getStars(film.metascore) }}</span>
          </p>
          <dl>
            <dt>Release date</dt><dd>{{ film.released }}</dd>
            <dt>Director</dt><dd>{{ film.director }}</dd>
            <dt>Actors</dt><dd>{{ film.actors }}</dd>
          </dl>
          <p class="plot">{{ film.plot }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useSession } from "@/stores/session";

export default {
  data() {
    return {
      title: 'Authentification',
      email: '',
      password: '',
      error: null,  // Ajout de la variable d'erreur
      films: [
        // Films d'exemple
        {
          title: 'Titanic',
          released: '19 Dec 1997',
          director: 'James Cameron',
          actors: 'Leonardo DiCaprio, Kate Winslet, Billy Zane, Kathy Bates',
          poster: 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg',
          plot: '84 years later, a 100 year-old woman named Rose DeWitt Bukater tells the story...',
          metascore: '75'
        },
        {
          title: 'Blade Runner',
          released: '25 Jun 1982',
          director: 'Ridley Scott',
          actors: 'Harrison Ford, Rutger Hauer, Sean Young, Edward James Olmos',
          poster: 'https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
          plot: 'A blade runner must pursue and terminate four replicants who stole a ship in space...',
          metascore: '89'
        },
        {
          title: 'The Shining',
          released: '13 Jun 1980',
          director: 'Stanley Kubrick',
          actors: 'Jack Nicholson, Shelley Duvall, Danny Lloyd, Scatman Crothers',
          poster: 'https://m.media-amazon.com/images/M/MV5BZWFlYmY2MGEtZjVkYS00YzU4LTg0YjQtYzY1ZGE3NTA5NGQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
          plot: 'A family heads to an isolated hotel for the winter...',
          metascore: '63'
        }
      ]
    };
  },
  computed: {
    // Récupération de l'état loggedIn de Pinia
    ...mapState(useSession, ['loggedIn'])
  },
  methods: {
    // Méthode pour soumettre le formulaire de connexion
    onSubmit() {
      if (this.email === 'email@email.com' && this.password === 'password') {
        this.error = null;  // Réinitialisation de l'erreur
        this.login({user: this.email, password: this.password});
      } else {
        this.error = 'Mauvais login / mot de passe';  // Affichage de l'erreur
      }
    },
    getStars(metascore) {
      if (metascore === 'N/A') return '';
      const score = parseInt(metascore);
      const stars = Math.round(score / 20);
      return '★'.repeat(stars) + '☆'.repeat(5 - stars);
    },
    ...mapActions(useSession, ['login'])  // Mapping de l'action de login
  }
};
</script>

<style scoped>
.films {
  list-style: none;
  padding: 0;
}

.film.card {
  border: 1px solid #ccc;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
}

.poster {
  width: 100px;
}

.rating {
  color: gold;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
