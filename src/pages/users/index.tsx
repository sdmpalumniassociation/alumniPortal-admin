import { Card, Table } from 'react-bootstrap';
import { usePageTitle } from '../../hooks';

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

    // Sample user data
    const users = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Admin',
            status: 'Active',
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'User',
            status: 'Active',
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike@example.com',
            role: 'User',
            status: 'Inactive',
        },
    ];

    return (
        <>
            <Card>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="header-title">Users List</h4>
                    </div>

                    <Table className="table-centered table-nowrap mb-0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <span
                                            className={`badge bg-${
                                                user.status === 'Active' ? 'success' : 'danger'
                                            }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </>
    );
};

export default Users;
