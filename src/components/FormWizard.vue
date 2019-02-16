<template>
  <div v-if="wizardInProgress">
    <keep-alive>
      <component
        ref="currentStep"
        :is="currentStep"
        :wizard-data="form"
        @update="processStep"
      />
    </keep-alive>

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
        :disabled="!canGoNext"
        @click="nextButtonAction"
        class="btn"
      >{{ isLastStep ? 'Complete Order' : 'Next' }}</button>
    </div>

    <pre><code>{{form}}</code></pre>
  </div>

  <div v-else>
    <h1 class="title">Thank you!</h1>
    <h2 class="subtitle">We look forward to shipping you your first box!</h2>
    <p class="text-center">
      <a href="#" class="btn">Go somewhere cool!</a>
    </p>
  </div>
</template>

<script>
import { postFormToDB } from '@/api'

import FormPlanPicker from './FormPlanPicker'
import FormUserDetails from './FormUserDetails'
import FormAddress from './FormAddress'
import FormReviewOrder from './FormReviewOrder'

export default {
  name: 'FormWizard',

  components: {
    FormPlanPicker,
    FormUserDetails,
    FormAddress,
    FormReviewOrder
  },

  data () {
    return {
      currentStepNumber: 1,
      canGoNext: false,

      steps: [
        'FormPlanPicker',
        'FormUserDetails',
        'FormAddress',
        'FormReviewOrder'
      ],

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
    length () {
      return this.steps.length
    },

    currentStep () {
      return this.steps[this.currentStepNumber - 1]
    },

    progress () {
      return this.currentStepNumber / this.length * 100
    },

    isLastStep () {
      return this.currentStepNumber === this.length
    },

    wizardInProgress () {
      return this.currentStepNumber <= this.length
    }
  },

  methods: {
    goBack () {
      this.currentStepNumber--
      this.canGoNext = true
    },

    goNext () {
      this.currentStepNumber++

      this.$nextTick(() => {
        this.canGoNext = !this.$refs.currentStep.$v.$invalid
      })
    },

    nextButtonAction () {
      if (this.isLastStep) this.submitOrder()
      else this.goNext()
    },

    processStep (step) {
      Object.assign(this.form, step.data)
      this.canGoNext = step.valid
    },

    submitOrder () {
      postFormToDB(this.form)
        .then(() => {
          this.currentStepNumber++
        })
    }
  }
}
</script>
