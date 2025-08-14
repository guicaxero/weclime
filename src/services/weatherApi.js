

export async function requestApi(city='Niteroi') {
    const API_KEY = import.meta.env.VITE_API_KEY
    const API_URL = import.meta.env.VITE_WEATHER_API
    
    try {
        const res = await fetch(`${API_URL}/current.json?key=${API_KEY}&q=${city}&lang=pt`)
        const data = await res.json()
        return data;
    } catch (error) {
        console.error('Falha na Requisição', error)
        throw error;
    }


}


export function saveListToLocalStorage(params) {
    localStorage.setItem('Lista de Cidades', JSON.stringify(params));
}