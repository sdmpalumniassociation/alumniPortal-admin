import { useState } from 'react';
import { Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import config from '../../config';

// components
import { VerticalForm, FormInput } from '../../components/form/';
import Loader from '../../components/Loader';
import AuthLayout from './AuthLayout';

type UserData = {
    email: string;
    password: string;
};

/* bottom links */
const BottomLink = () => {
    const { t } = useTranslation();

    return (
        <Row className="mt-3">
            <Col xs={12} className="text-center">
                <p className="text-muted">
                    <Link to="/auth/forget-password" className="text-muted ms-1">
                        <i className="fa fa-lock me-1"></i>
                        {t('Forgot your password?')}
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /*
    form validation schema
    */
    const schemaResolver = yupResolver(
        yup.object().shape({
            email: yup.string().required(t('Please enter Email')).email(t('Please enter valid Email')),
            password: yup.string().required(t('Please enter Password')),
        })
    );

    /*
    handle form submission
    */
    const onSubmit = async (formData: UserData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${config.API_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user data in localStorage
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.admin));
                // Redirect to dashboard
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout bottomLinks={<BottomLink />}>
            <div className="text-center mb-4">
                <h4 className="text-uppercase mt-0">{t('Admin Login')}</h4>
            </div>

            {error && (
                <Alert variant="danger" className="my-2">
                    {error}
                </Alert>
            )}
            {loading && <Loader />}

            <VerticalForm<UserData>
                onSubmit={onSubmit}
                resolver={schemaResolver}
            >
                <FormInput
                    type="email"
                    name="email"
                    label={t('Email address')}
                    placeholder={t('Enter your email address')}
                    containerClass={'mb-3'}
                />
                <FormInput
                    label={t('Password')}
                    type="password"
                    name="password"
                    placeholder={t('Enter your password')}
                    containerClass={'mb-3'}
                />

                <FormInput
                    type="checkbox"
                    name="checkbox"
                    label={t('Remember me')}
                    containerClass={'mb-3'}
                    defaultChecked
                />

                <div className="text-center d-grid mb-3">
                    <Button variant="primary" type="submit" disabled={loading}>
                        {t('Log In')}
                    </Button>
                </div>
            </VerticalForm>
        </AuthLayout>
    );
};

export default Login;
