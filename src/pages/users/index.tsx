import { useState, useEffect } from 'react';
import { Card, Table, Alert, Button, Modal } from 'react-bootstrap';
import { usePageTitle } from '../../hooks';
import config from '../../config';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    graduationYear: string;
    branch: string;
    status: string;
}

const Users = () => {
    usePageTitle({
        title: 'Users',
        breadCrumbItems: [
            {
                path: '/users',
                label: 'Users',
                active: true,
            },
        ],
    });

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${config.API_URL}/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setUsers(data.users);
            } else {
                setError(data.message || 'Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async () => {
        if (!userToDelete) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${config.API_URL}/admin/users/${userToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                // Remove user from the list
                setUsers(users.filter(user => user.id !== userToDelete.id));
                setShowDeleteModal(false);
                setUserToDelete(null);
            } else {
                setError(data.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Network error occurred');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="header-title">Users List</h4>
                    </div>

                    {error && (
                        <Alert variant="danger" className="my-2">
                            {error}
                        </Alert>
                    )}

                    <Table className="table-centered table-nowrap mb-0">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Branch</th>
                                <th>Graduation Year</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.branch}</td>
                                    <td>{user.graduationYear}</td>
                                    <td>
                                        <span
                                            className={`badge bg-${user.status === 'Active' ? 'success' : 'danger'}`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => {
                                                setUserToDelete(user);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete user {userToDelete?.name}? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Users;
