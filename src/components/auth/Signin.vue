<template>
    <div class="container">
        <div class="row col-12 col-md-5 offset-md-3 mx-auto">
            <!-- <pre>{{ $v }}</pre> -->
            <form class="w-75" @click.prevent="submit">

                <div class="form-group" :class="{ 'form-group--error': $v.user.email.$error }">
                    <label class="form__label">Email</label>
                    <input class="form__input form-control" @blur="$v.user.email.$touch()" v-model="user.email"/>
                    <div class="error" v-if="!$v.user.email.email && $v.dirty()">Please provide a valid email address.</div>
                </div>

                <div class="form-group" :class="{ 'form-group--error': $v.user.password.$error }">
                    <label class="form__label">Password</label>
                    <input class="form__input form-control" @blur="$v.user.password.$touch()" v-model="user.password"/>
                    <div class="error" v-if="!$v.user.password.required">Field is required</div>
                </div>
                <button type="submit" class="btn btn-md btn-primary" :disabled="$v.user.$invalid">Submit</button>
            </form>
        </div>
    </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators';

export default {
    data() {
        return {
            user: {
                email: "",
                password: "",
            },
        }
    },
    methods: {
        submit() {
            const loginData = {
                'email': this.user.email,
                'password': this.user.password,
            };

            return this.$store.dispatch('auth/signIn', loginData, { root: true });
            // console.log(this)
        },
    },
    validations: {
        user: {
            email: {
                required,
                email,
            },
            password: {
                required,
            },
        }
    }
}
</script>

<style>
.form-group--error .form__label {
    color: rgb(240, 65, 36);
}
.form-group--error input {
    border-color: rgb(247, 148, 131);
}
.form-group--error > .error {
    display: block;
    color: rgb(245, 127, 108);
    font-size: 0.75rem;
    line-height: 1;
    margin-top: .32rem;
    margin-bottom: .32rem;
}
</style>