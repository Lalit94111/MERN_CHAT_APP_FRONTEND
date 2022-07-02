import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// define a service user a base URL

const appApi = createApi({
    reducerPath: "appApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BACKEND_URL,
    }),

    endpoints: (builder) => ({
        // creating the user
        signupUser: builder.mutation({
            query: (user) => ({
                url: "/users",
                method: "POST",
                body: user,
            }),
        }),

        // login
        loginUser: builder.mutation({
            query: (user) => ({
                url: "/users/login",
                method: "POST",
                body: user,
            }),
        }),

        // logout

        logoutUser: builder.mutation({
            query: (payload) => ({
                url: "/logout",
                method: "DELETE",
                body: payload,
            }),
        }),

        //change Profile Pic

        changeProfilePicture: builder.mutation({
            query: (user) => ({
                url: "/users/changeprofilepic",
                method: "POST",
                body: user,
            }),
        })
    }),
});

export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation, useChangeProfilePictureMutation } = appApi;

export default appApi;
