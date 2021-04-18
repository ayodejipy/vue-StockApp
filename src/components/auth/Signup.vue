/* eslint-disable prettier/prettier */
<template>
    <div class="container">
        <div class="row col-12 col-md-5 offset-md-3 mx-auto">
            <!-- <pre>{{ $v }}</pre> -->
            <form class="w-75" @click.prevent="submit">
                <div class="form-group" :class="{ 'form-group--error': $v.user.name.$error }">
                    <label class="form__label">Name</label>
                    <input class="form__input form-control" @blur="$v.user.name.$touch()" v-model="user.name"/>
                    <div class="error" v-if="!$v.user.name.required">Field is required</div>
                    <div class="error" v-if="!$v.user.name.minLength">Name must have at least {{$v.user.name.$params.minLength.min}} letters.</div>
                </div>

                <div class="form-group" :class="{ 'form-group--error': $v.user.email.$error }">
                    <label class="form__label">Email</label>
                    <input class="form__input form-control" @blur="$v.user.email.$touch()" v-model="user.email"/>
                    <div class="error" v-if="!$v.user.email.email">Please provide a valid email address.</div>
                    <div class="error" v-if="!$v.user.email.unique">This email address has been taken.</div>
                </div>

                <div class="form-group" :class="{ 'form-group--error': $v.user.password.$error }">
                    <label class="form__label">Password</label>
                    <input class="form__input form-control" @blur="$v.user.password.$touch()" v-model="user.password"/>
                    <div class="error" v-if="!$v.user.password.required">Field is required</div>
                    <div class="error" v-if="!$v.user.password.minLength">Password must have at least {{$v.user.password.$params.minLength.min}} letters.</div>
                </div>

                <div class="form-group" :class="{ 'form-group--error': $v.user.confirmPassword.$error }">
                    <label class="form__label">Confirm Password</label>
                    <input class="form__input form-control" @blur="$v.user.confirmPassword.$touch()" v-model="user.confirmPassword"/>
                    <div class="error" v-if="!$v.user.confirmPassword.sameAsPassword">Password must be identical.</div>
                </div>

                <button type="submit" class="btn btn-md btn-primary" :disabled="$v.user.$invalid">Submit</button>
            </form>
        </div>
    </div>
</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';

export default {
    data() {
        return {
            user: {
                email: "",
                name: "",
                password: "",
                confirmPassword: ""
            },
        }
    },
    methods: {
        submit() {
            const data = {
                'name': this.user.name,
                'email': this.user.email,
                'password': this.user.password,
                'confirmPassword': this.user.confirmPassword
            };

            return this.$store.dispatch('auth/signUp', data, { root: true });
            // console.log(this)
        },
    },
    validations: {
        user: {
            name: { 
                required,
                minLength: minLength(4),
            },
            email: {
                required,
                email,
                unique: function( val ) {
                    if( val === "" ) return true;
                    return this.$axios.get('/users.json?orderBy="email"&equalTo=" ' + val + ' "')
                    .then( res => {
                        return Object.keys(res.data).length === 0;
                    });
                },
            },
            password: {
                required,
                minLength: minLength(5),
            },
            confirmPassword: {
                required,
                sameAsPassword: sameAs('password'),
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