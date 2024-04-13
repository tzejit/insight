import { getCurrentUser, fetchAuthSession, signOut } from "aws-amplify/auth";

// grabs current auth session and also verifies if user is authorized
async function fetch_auth() {
    var auth_session = null;
    var is_authed = false;
    try {
        auth_session = await fetchAuthSession();
        is_authed = true;
    } catch (err) {
        console.exception(err);
    }
    return { auth_session, is_authed };
}

// verify if user is authenticated, and do appropriate actions
async function fetch_user_auth_status() {
    const { auth_session, is_authed } = await fetch_auth();
    console.log("Is user authed?", is_authed);
    if (is_authed) {
        try {
            const { userId, signInDetails } = await getCurrentUser();
            console.debug("User is correctly authenticated");
            console.debug("Current session's user:", signInDetails.loginId);
            console.debug("Current session's user ID:", userId);
            console.debug(
                "Current session's Cognito ID:",
                auth_session.identityId
            );
            return {
                is_authed: true,
                username: signInDetails.loginId,
                userId: userId,
                awsId: auth_session.identityId,
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

export { do_sign_out, fetch_auth, fetch_user_auth_status };
