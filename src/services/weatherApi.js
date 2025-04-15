

export async function requestApi(city) {
    const API_KEY = '48bfdb31f6e440ffb55112831251504'
    
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&lang=pt`)
        const data = await res.json()
        console.log('passou por aqui', data)
        return data;
    } catch (error) {
        console.error('Falha na Requisição', error)
        throw error;
    }


}


export function saveListToLocalStorage(params) {
    localStorage.setItem('Lista de Cidades', JSON.stringify(params));
}