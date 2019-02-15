<template>
  <div>
    <FormPlanPicker v-if="currentStepNumber === 1"/>
    <FormUserDetails v-if="currentStepNumber === 2"/>

    <div class="progress-bar">
      <div :style="`width: ${progress}%;`"></div>
    </div>

    <!-- Actions -->
    <div class="buttons">
      <button
        @click="goBack"
        v-if="currentStepNumber > 1"
        class="btn-outlined"
      >Back</button>
      <button
        @click="goNext"
        class="btn"
      >Next</button>
    </div>

    <pre><code>{{form}}</code></pre>
  </div>
</template>

<script>
import FormPlanPicker from './FormPlanPicker'
import FormUserDetails from './FormUserDetails'

export default {
  name: 'FormWizard',

  components: {
    FormPlanPicker,
    FormUserDetails
  },

  data () {
    return {
      currentStepNumber: 1,
      length: 4,

      form: {
        plan: null,
        email: null,
        name: null,
        password: null,
        address: null,
        recipient: null,
        chocolate: false,
        otherTreat: false
      }
    }
  },

  computed: {
    progress () {
      return this.currentStepNumber / this.length * 100
    }
  },

  methods: {
    goBack () {
      this.currentStepNumber--
    },

    goNext () {
      this.currentStepNumber++
    }
  }
}
</script>
