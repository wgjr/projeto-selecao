import Menu from "../components/Menu";
const MainLayout = ({ children }) => {
    return (
        <div className="app">
            <header className="topbar">
                <div className="logo">Payments</div>
                <div className="user-icon"><img src={require('../assets/Avatar.png')}/></div>
            </header>

            <div className="main-layout">
                <aside className="sidebar">
                    <Menu />
                </aside>

                <main className="content">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
