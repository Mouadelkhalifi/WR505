import axios from 'axios';

export async function getUserProfile() {
    return await axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
}

export async function updateUserProfile(profile) {
    return await axios.put('/api/user/profile', profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
}
