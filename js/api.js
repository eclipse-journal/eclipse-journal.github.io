export async function api(body, auth_token, endpoint) {
    try {
        const response = await fetch(
            `https://szzslijzpkujryqivoxn.supabase.co/functions/v1/${endpoint}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth_token}`
                },
                body: JSON.stringify(body),
                redirect: "follow"
            }
        );
        return await response.text();
    } catch (error) {
        console.error(error);
    }
}