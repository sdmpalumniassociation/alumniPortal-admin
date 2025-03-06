export const isAuthenticated = () => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    return !!token && !!user;
};

export const getAdminUser = () => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
};

export const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/login';
}; 