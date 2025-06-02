export async function api(body, auth_token, endpoint) {
    const Headers = new Headers();
    Headers.append("Content-Type", "application/json");
    Headers.append("Authorization", `Bearer ${auth_token}`);

    const raw = JSON.stringify(body);

    const requestOptions = {
        method: "POST",
        headers: Headers,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`https://szzslijzpkujryqivoxn.supabase.co/functions/v1/${endpoint}`, requestOptions);
        return await response.text();
    } catch (error) {
        console.error(error);
    }
}