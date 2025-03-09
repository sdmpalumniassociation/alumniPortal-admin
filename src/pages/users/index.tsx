import { useState, useEffect } from 'react';
import { Card, Alert, Button, Modal } from 'react-bootstrap';
import { usePageTitle } from '../../hooks';
import config from '../../config';

// components
import Table from '../../components/Table';

interface User {
    id: string;
    alumniId: string;
    fullName: string;
    email: string;
    branch: string;
    graduationYear: string;
    currentPosition: string;
    company: string;
    technicalExpertise: string[];
    education: Array<{
        degree: string;
        field: string;
        institution: string;
        year: string;
    }>;
    phone: string;
    whatsappNumber: string;
    address: string;
    linkedIn: string;
    imageUrl: string;
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
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
        if (!selectedUser) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${config.API_URL}/admin/users/${selectedUser.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setUsers(users.filter(user => user.id !== selectedUser.id));
                setShowDeleteModal(false);
                setSelectedUser(null);
            } else {
                setError(data.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Network error occurred');
        }
    };

    const columns = [
        {
            Header: 'Alumni ID',
            accessor: 'alumniId',
            sort: true,
        },
        {
            Header: 'Name',
            accessor: 'fullName',
            sort: true,
        },
        {
            Header: 'Branch',
            accessor: 'branch',
            sort: true,
        },
        {
            Header: 'Graduation Year',
            accessor: 'graduationYear',
            sort: true,
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }: { row: any }) => (
                <>
                    <Button
                        variant="info"
                        size="sm"
                        className="me-1"
                        onClick={() => {
                            setSelectedUser(row.original);
                            setShowViewModal(true);
                        }}
                    >
                        View
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                            setSelectedUser(row.original);
                            setShowDeleteModal(true);
                        }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    const sizePerPageList = [
        {
            text: '5',
            value: 5,
        },
        {
            text: '10',
            value: 10,
        },
        {
            text: '25',
            value: 25,
        },
        {
            text: 'All',
            value: users.length,
        },
    ];

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

                    <Table
                        columns={columns}
                        data={users}
                        pageSize={10}
                        sizePerPageList={sizePerPageList}
                        isSortable={true}
                        pagination={true}
                        isSearchable={true}
                    />
                </Card.Body>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete user {selectedUser?.fullName}? This action cannot be undone.
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

            {/* View User Details Modal */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div className="user-details">
                            <div className="d-flex align-items-center mb-3">
                                <img
                                    src={selectedUser.imageUrl}
                                    alt={selectedUser.fullName}
                                    className="rounded-circle me-3"
                                    style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                                    onError={(e: any) => {
                                        e.target.src = `https://ny2fsuwtzwiq1t6s.public.blob.vercel-storage.com/default-user-JkNfvWTp7X1p14TXs1462jMc4PgNew.png`;
                                    }}
                                />
                                <div>
                                    <h5 className="mb-1">{selectedUser.fullName}</h5>
                                    <p className="mb-0 text-muted">Alumni ID: {selectedUser.alumniId}</p>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <h6>Personal Information</h6>
                                    <p><strong>Email:</strong> {selectedUser.email}</p>
                                    <p><strong>Branch:</strong> {selectedUser.branch}</p>
                                    <p><strong>Graduation Year:</strong> {selectedUser.graduationYear}</p>
                                    <p><strong>Phone:</strong> {selectedUser.phone}</p>
                                    <p><strong>WhatsApp:</strong> {selectedUser.whatsappNumber}</p>
                                </div>
                                <div className="col-md-6">
                                    <h6>Professional Information</h6>
                                    <p><strong>Current Position:</strong> {selectedUser.currentPosition}</p>
                                    <p><strong>Company:</strong> {selectedUser.company}</p>
                                    <p><strong>LinkedIn:</strong> {selectedUser.linkedIn || 'Not provided'}</p>
                                    <p><strong>Address:</strong> {selectedUser.address || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="mb-3">
                                <h6>Technical Expertise</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {selectedUser.technicalExpertise && selectedUser.technicalExpertise.length > 0 ? (
                                        selectedUser.technicalExpertise.map((skill, index) => (
                                            <span key={index} className="badge bg-primary">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-muted">No technical expertise listed</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h6>Education</h6>
                                {selectedUser.education && selectedUser.education.length > 0 ? (
                                    selectedUser.education.map((edu, index) => (
                                        <div key={index} className="mb-2">
                                            <p className="mb-1">
                                                <strong>{edu.degree}</strong> in {edu.field}
                                            </p>
                                            <p className="mb-1 text-muted">
                                                {edu.institution} ({edu.year})
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted">No additional education details available</p>
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Users;
