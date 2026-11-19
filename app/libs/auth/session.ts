// Constants/Variables
let sessionEndExpected = false;

// Functions

/**
 * Marks that the admin is ending this session themselves (logout, password change). The backend then revokes this
 * session too, and its force-logout notice or a 401 can arrive before the API response, so they must not be handled
 * as an unexpected logout. Pass `false` when the operation fails.
 */
export function expectSessionEnd(expected: boolean = true) {
    sessionEndExpected = expected;
}

export const isSessionEndExpected = () => sessionEndExpected;
