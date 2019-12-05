export const unauthorized = (response) => {
    if(!response.ok) {
        if(response.status == 401) {
            localStorage.removeItem('user');
            location.reload(true);
        }

        return Promise.reject(response.error);
    }
    return Promise.resolve(response.json());
}