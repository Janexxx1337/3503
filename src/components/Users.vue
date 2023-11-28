<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="email" type="email" placeholder="Почта" required />
    <input v-model="number" type="text" placeholder="Номер" v-mask />
    <button type="submit">Искать</button>
    <span v-if="loading" class="loader"></span>
  </form>
  <div v-if="error" class="error-message">{{ error }}</div>
  <div v-if="success" class="success-message">Ваш пользователь!</div>
  <div v-if="results">
    <div v-for="result in results" :key="result">
      {{ result }}
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue';
import axios from 'axios';

const maskDirective = {
  beforeMount(el) {
    el.oninput = function(e) {
      if (!e.isTrusted) return;

      const x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,2})(\d{0,2})/);
      e.target.value = !x[2] ? x[1] : `${x[1]}-${x[2]}` + (x[3] ? `-${x[3]}` : '');
    };
  }
};

export default defineComponent({
  directives: {
    mask: maskDirective
  },

  setup() {
    const email = ref('');
    const number = ref('');
    const results = ref(null);
    const loading = ref(false);
    const error = ref('');
    const success = ref(false);

    const handleSubmit = async () => {
      loading.value = true;
      error.value = '';
      success.value = false;
      results.value = null;

      try {
        const response = await fetch('http://localhost:3000/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.value, number: number.value.replace(/-/g, '') })
        });

        if (!response.ok) {
          if (response.status === 404) {
            error.value = 'Пользователь не найден';
          } else {
            throw new Error('Произошла ошибка. Пожалуйста, попробуйте снова.');
          }
        } else {
          const data = await response.json();
          results.value = data;
          success.value = true;
        }
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    return { email, number, results, handleSubmit, loading, error, success };
  }
});
</script>


<style>
form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: #fff;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

.error-message, .success-message {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}

.error-message {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.success-message {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  position: absolute;
  left: 48%;
  transform: translateX(-40%);
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>

