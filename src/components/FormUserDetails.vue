<template>
  <div>
    <h1 class="title">Create Account</h1>

    <h2 class="subtitle">Create an account or log in to order your liquid gold subscription</h2>

    <form v-if="!loggedIn" @input="submit" class="form">
      <div class="form-group">
        <label class="form-label" for="email">Email</label>
        <input
          v-model="$v.form.email.$model"
          @input="checkIfUserExists"
          type="text"
          id="email"
          class="form-control"
          placeholder="your@email.com"
        >
        <div
          v-if="$v.form.email.$error && !$v.form.email.required"
          class="error"
        >email is required</div>
        <div
          v-if="$v.form.email.$error && !$v.form.email.email"
          class="error"
        >email is invalid</div>
      </div>

      <div v-if="emailCheckedInDB" class="form-group">
        <label class="form-label" for="password">Password</label>
        <input
          v-model="$v.form.password.$model"
          type="password"
          id="password"
          class="form-control"
          placeholder="Super Secret Password"
        >
        <div
          v-if="$v.form.password.$error && !$v.form.password.required"
          class="error"
        >password is required</div>
        <div
          v-if="$v.form.password.$error && !$v.form.password.correct"
          class="error"
        >password is invalid - try again</div>
      </div>

      <div v-if="existingUser" class="form-group">
        <button @click.prevent="login" class="btn">Login</button>
      </div>

      <div v-if="emailCheckedInDB && !existingUser" class="form-group">
        <label class="form-label" for="name">Name</label>
        <input
          v-model="$v.form.name.$model"
          type="text"
          id="name"
          class="form-control"
          placeholder="What should we call you?"
        >
        <div
          v-if="$v.form.name.$error"
          class="error"
        >name is required</div>
      </div>
    </form>

    <div v-else class="text-center">
      Successfully logged in! <a href="#" @click="reset">Not {{ form.name }}?</a>
    </div>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { authenticateUser, checkIfUserExistsInDB } from '@/api'

export default {
  data () {
    return {
      emailCheckedInDB: false,
      existingUser: false,
      wrongPassword: false,

      form: {
        email: null,
        password: null,
        name: null
      }
    }
  },

  validations: {
    form: {
      email: {
        required,
        email
      },

      password: {
        required,

        correct () {
          return !this.wrongPassword
        }
      },

      name: { required }
    }
  },

  computed: {
    loggedIn () {
      return this.existingUser && this.form.name
    }
  },

  methods: {
    checkIfUserExists () {
      if (!this.$v.form.email.$invalid) {
        return checkIfUserExistsInDB(this.form.email)
          .then(() => {
            // USER EXISTS
            this.existingUser = true
            this.emailCheckedInDB = true
          })
          .catch(() => {
            // USER DOESN'T EXIST
            this.existingUser = false
            this.emailCheckedInDB = true
          })
      }
    },

    login () {
      this.wrongPassword = false

      if (!this.$v.form.password.$invalid) {
        return authenticateUser(this.form.email, this.form.password)
          .then((user) => {
            // LOGGED IN
            this.form.name = user.name
            this.submit()
          })
          .catch(() => {
            // WRONG PASSWORD?
            this.wrongPassword = true
          })
      }
    },

    reset () {
      this.form.email = null
      this.form.password = null
      this.form.name = null
      this.emailCheckedInDB = false
      this.wrongPassword = false
      this.existingUser = false
      this.$v.$reset()
    },

    submit () {
      this.$emit('update', {
        data: {
          email: this.form.email,
          password: this.form.password,
          name: this.form.name
        },

        valid: !this.$v.$invalid
      })
    }
  }
}
</script>
