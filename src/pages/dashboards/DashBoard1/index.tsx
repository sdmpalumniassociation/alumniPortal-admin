import { usePageTitle } from '../../../hooks';

// component
import Statistics from './Statistics';

const DashBoard1 = () => {
    
    usePageTitle({
        title: 'DashBoard',
        breadCrumbItems: [
            {
                path: '/dashboard',
                label: 'DashBoard',
                active: true,
            },
        ],
    });

    return (
        <>
            <Statistics />
        </>
    );
};

export default DashBoard1;
