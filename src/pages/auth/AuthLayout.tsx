import { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// images
import LogoDark from '../../assets/images/sdmp-logo.png';

type AccountLayoutProps = {
    hasLogo?: boolean;
    bottomLinks?: any;
    children?: React.ReactNode;
};

const AuthLayout = ({ hasLogo, bottomLinks, children }: AccountLayoutProps) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (document.body) {
            document.body.classList.add('authentication-bg');
        }
        return () => {
            if (document.body) {
                document.body.classList.remove('authentication-bg');
            }
        };
    }, []);

    return (
        <div className="account-pages my-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={4}>
                        {hasLogo && (
                            <div className="text-center">
                                <div className="auth-logo mb-4">
                                    <Link to="/" className="logo logo-dark text-center">
                                        <span className="logo-lg">
                                            <img src={LogoDark} alt="" />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        )}
                        <Card>
                            <Card.Body className="p-4">{children}</Card.Body>
                        </Card>

                        {/* bottom links */}
                        {bottomLinks}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

AuthLayout.defaultProps = {
    hasLogo: true,
};

export default AuthLayout;
