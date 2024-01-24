export default async () => {
    const data = {
        name: "党チンテン",
        number: "5420045",
        belong: "日本大学文理学部"
    };
    return new Response(JSON.stringify(data));
};