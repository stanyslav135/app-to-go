import Header from '../components/header/header';

export function DashboardLayout({children}) {

    return (
        <>
            <Header/>
            {children}
        </>
    );
}