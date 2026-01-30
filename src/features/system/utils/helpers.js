
export const uid = () => `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;

export const nowStr = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
        d.getHours()
    )}:${pad(d.getMinutes())}`;
};

export const yesNo = (b) => (b ? "YES" : "NO");
