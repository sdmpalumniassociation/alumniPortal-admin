import { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { usePageTitle } from '../../hooks';
import config from '../../config';

interface UserGroup {
    id: string;
    name: string;
}

const BroadcastMail = () => {
    usePageTitle({
        title: 'Broadcast Mail',
        breadCrumbItems: [
            {
                path: '/broadcast-mail',
                label: 'Broadcast Mail',
                active: true,
            },
        ],
    });

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [customEmails, setCustomEmails] = useState('');
    const [groups] = useState<UserGroup[]>([
        { id: 'alumni', name: 'All Alumni' },
        { id: 'custom', name: 'Custom Emails' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!subject.trim()) {
            setError('Subject is required');
            return;
        }

        if (!message.trim()) {
            setError('Message content is required');
            return;
        }

        if (selectedGroups.length === 0) {
            setError('Please select at least one recipient group');
            return;
        }

        // Validate custom emails if custom option is selected
        if (selectedGroups.includes('custom') && !customEmails.trim()) {
            setError('Please enter at least one email address for custom recipients');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${config.API_URL}/admin/broadcast-email`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subject,
                    message,
                    groups: selectedGroups,
                    customEmails: selectedGroups.includes('custom')
                        ? customEmails.split(',').map(email => email.trim())
                        : []
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                // Reset form
                setSubject('');
                setMessage('');
                setSelectedGroups([]);
                setCustomEmails('');
            } else {
                setError(data.message || 'Failed to send broadcast email');
            }
        } catch (error) {
            console.error('Error sending broadcast mail:', error);
            setError('Network error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle checkbox changes
    const handleGroupChange = (groupId: string) => {
        if (selectedGroups.includes(groupId)) {
            setSelectedGroups(selectedGroups.filter(id => id !== groupId));
        } else {
            setSelectedGroups([...selectedGroups, groupId]);
        }
    };

    return (
        <>
            <Card>
                <Card.Body>
                    <h4 className="header-title mb-3">Send Broadcast Email</h4>

                    {error && (
                        <Alert variant="danger" className="my-2">
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert variant="success" className="my-2">
                            {success}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email Subject</Form.Label>
                            <Form.Control
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Enter email subject"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Recipients</Form.Label>
                            <div className="d-flex flex-wrap">
                                {groups.map((group) => (
                                    <Form.Check
                                        key={group.id}
                                        type="checkbox"
                                        id={`group-${group.id}`}
                                        label={group.name}
                                        className="me-3 mb-2"
                                        checked={selectedGroups.includes(group.id)}
                                        onChange={() => handleGroupChange(group.id)}
                                    />
                                ))}
                            </div>

                            {selectedGroups.includes('custom') && (
                                <div className="mt-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter email addresses separated by commas"
                                        value={customEmails}
                                        onChange={(e) => setCustomEmails(e.target.value)}
                                    />
                                    <Form.Text className="text-muted">
                                        Example: user1@example.com, user2@example.com
                                    </Form.Text>
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Message Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={8}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Compose your email message here"
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group className="mb-0 text-end">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Sending...' : 'Send Broadcast Email'}
                                    </Button>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
};

export default BroadcastMail; 