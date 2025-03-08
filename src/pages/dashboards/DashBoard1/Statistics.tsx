import { Col, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import config from '../../../config';

// component
import StatisticsWidget1 from '../../../components/StatisticsWidget1';
import StatisticsWidget2 from '../../../components/StatisticsWidget2';

interface UserStats {
    totalUsers: number;
    newUsers: number;
    percentageGrowth: number;
}

const Statistics = () => {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${config.API_URL}/admin/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setStats(data.stats);
                } else {
                    setError(data.message || 'Failed to fetch statistics');
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                setError('Network error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <Row>
            <Col xl={3} md={6}>
                <StatisticsWidget1
                    title="Total Alumni"
                    data={stats?.newUsers || 0}
                    stats={stats?.totalUsers || 0}
                    color={'#f05050'}
                    subTitle={`${stats?.percentageGrowth || 0}% growth in last 30 days`}
                />
            </Col>
            {/* <Col xl={3} md={6}>
                <StatisticsWidget2
                    variant="success"
                    title="Sales Analytics"
                    trendValue="32%"
                    trendIcon="mdi mdi-trending-up"
                    stats={8451}
                    subTitle="Revenue today"
                    progress={77}
                />
            </Col>
            <Col xl={3} md={6}>
                <StatisticsWidget1
                    title="Statistics"
                    color={'#ffbd4a'}
                    data={80}
                    stats={4569}
                    subTitle="Revenue today"
                />
            </Col>
            <Col xl={3} md={6}>
                <StatisticsWidget2
                    variant="pink"
                    title="Daily Sales"
                    trendValue="32%"
                    trendIcon="mdi mdi-trending-up"
                    stats={158}
                    subTitle="Revenue today"
                    progress={77}
                />
            </Col> */}
        </Row>
    );
};

export default Statistics;
