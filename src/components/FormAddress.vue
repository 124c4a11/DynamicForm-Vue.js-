<template>
  <div>
    <h1 class="title">Delivery details</h1>

    <h2 class="subtitle">Where should we send your freshly roasted coffee beans?</h2>

    <form @input="submit" class="form">
      <div class="form-group">
        <label class="form-label" for="delivery_name">Name</label>
        <input
          v-model="$v.form.recipient.$model"
          type="text"
          id="delivery_name"
          class="form-control"
          placeholder="Recipients Name"
        >
        <div v-if="$v.form.recipient.$error" class="error">field is required</div>
      </div>

      <div class="form-group">
        <label class="form-label" for="address">Address</label>
        <textarea
          v-model="$v.form.address.$model"
          id="address"
          class="form-control"
          rows="3"
          placeholder="London Street 470978 New England"
        ></textarea>
        <div v-if="$v.form.address.$error" class="error">field is required</div>
      </div>
    </form>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      form: {
        address: null,
        recipient: null
      }
    }
  },

  validations: {
    form: {
      address: { required },
      recipient: { required }
    }
  },

  methods: {
    submit () {
      if (!this.$v.$invalid) {
        this.$emit('update', {
          address: this.form.address,
          recipient: this.form.recipient
        })
      }
    }
  }
}
</script>
