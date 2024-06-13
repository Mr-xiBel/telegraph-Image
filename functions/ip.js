export async function onRequest(context) {
    const { request, env } = context;
    let ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("cf-connecting-ip") ||
             request.headers.get("clientIP") ||
             request.headers.get("forwarded")?.split(", ")[0].split("=")[1]; // 解析forwarded头中的IP
    
    // 如果forwarded头存在且格式符合预期，提取IP
    if (!ip && request.headers.get("forwarded")) {
        const forwardedParts = request.headers.get("forwarded").split("; ");
        for (const part of forwardedParts) {
            if (part.startsWith("for=")) {
                ip = part.substring(4);
                break;
            }
        }
    }

    const asOrganization = request.cf.asOrganization || "";
    
    return new Response(JSON.stringify({
        "ip": ip || "Unknown",
        "asOrganization": asOrganization
    }), {
        headers: {
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
        },
    });
}
