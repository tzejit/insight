import { getCurrentUser, fetchAuthSession, signOut } from "aws-amplify/auth";

// use this function as reference for getting tokens to access backend services
async function get_session_tokens() {
    try {
        const { accessToken, idToken } =
            (await fetchAuthSession()).tokens ?? {};
    } catch (err) {
        console.log(err);
    }
}

// simple function to see if user is authorized to see this page
async function is_user_authed() {
    try {
        const auth_session = await fetchAuthSession();
        return true;
    } catch (err) {
        return false;
    }
}

// verify if user is authenticated, and do appropriate actions
async function fetch_user_auth_status() {
    if (is_user_authed()) {
        try {
            const { userId, signInDetails } = await getCurrentUser();
            console.debug("User is correctly authenticated");
            console.debug("Current session's user:", signInDetails.loginId);
            console.debug("Current session's user ID:", userId);
            return {
                is_authed: true,
                username: signInDetails.loginId,
                userId: userId,
            };
        } catch (err) {
            console.warn("User probably not authed", err);
        }
    }
    return { is_authed: false };
}

async function do_sign_out() {
    try {
        await signOut();
    } catch (error) {
        console.error("Error signing out", error);
    }
}

export { get_session_tokens, do_sign_out, fetch_user_auth_status };
